extends CharacterBody2D

signal hp_changed(current_hp: int, max_hp: int)
signal died

const PlayerBullet := preload("res://scenes/bullets/player_bullet.tscn")

const PLAYER_FRAME_DIR := "res://assets/characters/player/"
const PLAYER_ANIMATION_FRAMES := {
	"idle": ["idle_0.png", "idle_1.png"],
	"run": ["run_0.png", "run_1.png", "run_2.png"],
	"jump": ["jump_0.png"],
	"shoot": ["shoot_0.png"],
	"charge": ["charge_0.png"],
	"hurt": ["hurt_0.png"],
	"death": ["death_0.png"],
	"victory": ["victory_0.png"],
}
const PLAYER_ANIMATION_SPEEDS := {
	"idle": 3.0,
	"run": 10.0,
	"jump": 1.0,
	"shoot": 1.0,
	"charge": 1.0,
	"hurt": 1.0,
	"death": 1.0,
	"victory": 1.0,
}
const PLAYER_LOOPING_ANIMATIONS := ["idle", "run", "jump", "charge", "victory"]

@export var max_hp := 8
@export var speed := 330.0
@export var acceleration := 2600.0
@export var friction := 3200.0
@export var jump_velocity := -650.0
@export var gravity := 1800.0
@export var shot_cooldown := 0.18
@export var invulnerable_time := 0.9
@export var knockback_control_lock := 0.16
@export var charge_required_time := 0.75
@export var coyote_time := 0.10
@export var jump_buffer_time := 0.10

@onready var visual: AnimatedSprite2D = $Visual
@onready var charge_aura: Node2D = $ChargeAura
@onready var muzzle: Marker2D = $Muzzle

var hp := max_hp
var facing := 1
var shot_timer := 0.0
var invulnerable_timer := 0.0
var control_lock_timer := 0.0
var coyote_timer := 0.0
var jump_buffer_timer := 0.0
var charge_time := 0.0
var shot_pose_timer := 0.0
var controls_enabled := true
var was_jump_pressed := false
var was_shoot_pressed := false
var anim_state := "idle"
var forced_anim := ""

func _ready() -> void:
	add_to_group("player")
	_setup_sprite_frames()
	hp = max_hp
	hp_changed.emit(hp, max_hp)
	_play_player_animation("idle")

func _physics_process(delta: float) -> void:
	shot_timer = maxf(0.0, shot_timer - delta)
	invulnerable_timer = maxf(0.0, invulnerable_timer - delta)
	control_lock_timer = maxf(0.0, control_lock_timer - delta)
	jump_buffer_timer = maxf(0.0, jump_buffer_timer - delta)
	shot_pose_timer = maxf(0.0, shot_pose_timer - delta)

	if not controls_enabled:
		velocity.x = move_toward(velocity.x, 0.0, speed * delta)
		velocity.y += gravity * delta
		move_and_slide()
		_update_visual()
		return

	var axis := 0.0
	if Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_A):
		axis -= 1.0
	if Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_D):
		axis += 1.0

	if control_lock_timer > 0.0:
		axis = 0.0

	if axis != 0.0:
		facing = int(signf(axis))
		velocity.x = move_toward(velocity.x, axis * speed, acceleration * delta)
	elif control_lock_timer <= 0.0:
		velocity.x = move_toward(velocity.x, 0.0, friction * delta)

	if not is_on_floor():
		velocity.y += gravity * delta
	else:
		coyote_timer = coyote_time
		velocity.y = minf(velocity.y, 0.0)

	var jump_pressed := Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_Z)
	if jump_pressed and not was_jump_pressed:
		jump_buffer_timer = jump_buffer_time
	if jump_buffer_timer > 0.0 and coyote_timer > 0.0:
		velocity.y = jump_velocity
		jump_buffer_timer = 0.0
		coyote_timer = 0.0
		_play_sound("play_jump")
	was_jump_pressed = jump_pressed

	var shoot_pressed := Input.is_key_pressed(KEY_X) or Input.is_key_pressed(KEY_J)
	if shoot_pressed:
		charge_time += delta
	if was_shoot_pressed and not shoot_pressed:
		shoot(charge_time >= charge_required_time)
		charge_time = 0.0
	was_shoot_pressed = shoot_pressed

	muzzle.position.x = 32.0 * facing
	move_and_slide()
	if not is_on_floor():
		coyote_timer = maxf(0.0, coyote_timer - delta)
	_update_anim_state(axis)
	_update_visual()

func shoot(charged := false) -> void:
	if shot_timer > 0.0:
		return
	shot_timer = shot_cooldown
	shot_pose_timer = 0.16
	var bullet = PlayerBullet.instantiate()
	bullet.global_position = muzzle.global_position
	bullet.call("setup", facing, charged)
	get_tree().current_scene.add_child(bullet)
	_play_sound("play_charge_shot" if charged else "play_shot")

func take_damage(amount: int, from_position: Vector2) -> void:
	if invulnerable_timer > 0.0 or hp <= 0:
		return
	invulnerable_timer = invulnerable_time
	control_lock_timer = knockback_control_lock
	hp = maxi(0, hp - amount)
	hp_changed.emit(hp, max_hp)
	var knock_direction := signf(global_position.x - from_position.x)
	if knock_direction == 0.0:
		knock_direction = -float(facing)
	velocity = Vector2(knock_direction * 420.0, -330.0)
	charge_time = 0.0
	_play_sound("play_hurt")
	if hp == 0:
		controls_enabled = false
		forced_anim = "death"
		_update_visual()
		died.emit()

func _update_anim_state(axis: float) -> void:
	if forced_anim != "":
		anim_state = forced_anim
	elif hp <= 0:
		anim_state = "death"
	elif invulnerable_timer > 0.0 and control_lock_timer > 0.0:
		anim_state = "hurt"
	elif charge_time > 0.18:
		anim_state = "charge"
	elif shot_pose_timer > 0.0:
		anim_state = "shoot"
	elif not is_on_floor():
		anim_state = "jump"
	elif absf(axis) > 0.0:
		anim_state = "run"
	else:
		anim_state = "idle"

func _update_visual() -> void:
	visual.flip_h = facing < 0
	visual.visible = not (invulnerable_timer > 0.0 and int(Time.get_ticks_msec() / 90) % 2 == 0)
	if anim_state == "charge":
		visual.modulate = Color(0.72, 1.0, 1.0)
	elif anim_state == "hurt":
		visual.modulate = Color(1.0, 0.66, 0.66)
	else:
		visual.modulate = Color.WHITE
	_play_player_animation(anim_state)
	if charge_aura.has_method("set_charge_ratio"):
		charge_aura.call("set_charge_ratio", charge_time / charge_required_time)

func play_victory() -> void:
	forced_anim = "victory"
	velocity = Vector2.ZERO
	_update_visual()

func _play_player_animation(animation_name: String) -> void:
	if visual.sprite_frames == null or not visual.sprite_frames.has_animation(animation_name):
		return
	if visual.animation != animation_name:
		visual.play(animation_name)

func _setup_sprite_frames() -> void:
	var sprite_frames := SpriteFrames.new()
	for animation_name in PLAYER_ANIMATION_FRAMES.keys():
		sprite_frames.add_animation(animation_name)
		sprite_frames.set_animation_speed(animation_name, PLAYER_ANIMATION_SPEEDS.get(animation_name, 1.0))
		sprite_frames.set_animation_loop(animation_name, animation_name in PLAYER_LOOPING_ANIMATIONS)
		for file_name in PLAYER_ANIMATION_FRAMES[animation_name]:
			sprite_frames.add_frame(animation_name, _load_player_texture(file_name, animation_name))
	visual.sprite_frames = sprite_frames

func _load_player_texture(file_name: String, animation_name: String) -> Texture2D:
	var image := Image.new()
	var error := image.load(PLAYER_FRAME_DIR + file_name)
	if error != OK:
		image = _make_fallback_frame(animation_name)
	return ImageTexture.create_from_image(image)

func _make_fallback_frame(animation_name: String) -> Image:
	var image := Image.create(96, 96, false, Image.FORMAT_RGBA8)
	image.fill(Color(0, 0, 0, 0))
	var body_color := Color(0.20, 0.55, 1.00)
	if animation_name == "hurt":
		body_color = Color(1.0, 0.35, 0.25)
	elif animation_name == "charge":
		body_color = Color(0.20, 0.90, 1.00)
	elif animation_name == "death":
		body_color = Color(0.28, 0.32, 0.42)
	elif animation_name == "victory":
		body_color = Color(0.25, 0.80, 1.00)
	_fill_image_rect(image, Rect2i(Vector2i(34, 30), Vector2i(28, 38)), body_color)
	_fill_image_rect(image, Rect2i(Vector2i(30, 22), Vector2i(32, 16)), Color(0.08, 0.16, 0.42))
	_fill_image_rect(image, Rect2i(Vector2i(58, 40), Vector2i(24, 12)), Color(0.08, 0.16, 0.42))
	_fill_image_rect(image, Rect2i(Vector2i(38, 66), Vector2i(10, 18)), Color(0.08, 0.16, 0.42))
	_fill_image_rect(image, Rect2i(Vector2i(52, 66), Vector2i(10, 18)), Color(0.08, 0.16, 0.42))
	return image

func _fill_image_rect(image: Image, rect: Rect2i, color: Color) -> void:
	var left := clampi(rect.position.x, 0, image.get_width())
	var top := clampi(rect.position.y, 0, image.get_height())
	var right := clampi(rect.position.x + rect.size.x, 0, image.get_width())
	var bottom := clampi(rect.position.y + rect.size.y, 0, image.get_height())
	for y in range(top, bottom):
		for x in range(left, right):
			image.set_pixel(x, y, color)

func _play_sound(method_name: String) -> void:
	var sound := get_tree().get_first_node_in_group("sound_manager")
	if sound != null and sound.has_method(method_name):
		sound.call(method_name)
