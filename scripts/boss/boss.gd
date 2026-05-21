extends CharacterBody2D

signal hp_changed(current_hp: int, max_hp: int)
signal defeated

const EnemyBullet := preload("res://scenes/bullets/enemy_bullet.tscn")
const ExplosionScene := preload("res://scenes/effects/explosion.tscn")

@export var max_hp := 28
@export var gravity := 1800.0
@export var contact_damage := 2
@export var arena_left := 2180.0
@export var arena_right := 2530.0

@onready var hitbox: Area2D = $Hitbox
@onready var muzzle: Marker2D = $Muzzle
@onready var visual: Sprite2D = $Visual

var hp := max_hp
var active := false
var defeated_flag := false
var pattern_index := 0
var pattern_timer := 0.0
var local_timer := 0.0
var shot_timer := 0.0
var facing := -1
var flash_timer := 0.0

func _ready() -> void:
	add_to_group("enemies")
	add_to_group("boss")
	hp = max_hp
	hp_changed.emit(hp, max_hp)

func start_battle() -> void:
	if active or defeated_flag:
		return
	active = true
	pattern_index = 0
	_start_pattern()
	hp_changed.emit(hp, max_hp)

func _physics_process(delta: float) -> void:
	flash_timer = maxf(0.0, flash_timer - delta)
	if not is_on_floor():
		velocity.y += gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	var player := get_tree().get_first_node_in_group("player") as Node2D
	if player != null:
		facing = -1 if player.global_position.x < global_position.x else 1
		muzzle.position.x = 64.0 * facing
		_update_visual()

	if active and not defeated_flag:
		_run_pattern(delta, player)
	else:
		velocity.x = move_toward(velocity.x, 0.0, 900.0 * delta)

	move_and_slide()
	global_position.x = clampf(global_position.x, arena_left, arena_right)

	for body in hitbox.get_overlapping_bodies():
		if body.has_method("take_damage") and body.is_in_group("player"):
			body.call("take_damage", contact_damage, global_position)

func _run_pattern(delta: float, player: Node2D) -> void:
	pattern_timer -= delta
	local_timer += delta
	shot_timer -= delta

	match pattern_index:
		0:
			velocity.x = 0.0
			if shot_timer <= 0.0 and player != null:
				shot_timer = 0.62
				_fire_at(player.global_position, 330.0)
		1:
			if is_on_floor() and local_timer < 0.12:
				velocity = Vector2(360.0 * facing, -560.0)
			if is_on_floor() and local_timer > 0.35:
				velocity.x = move_toward(velocity.x, 0.0, 1400.0 * delta)
		2:
			velocity.x = 0.0
			if shot_timer <= 0.0:
				shot_timer = 0.48
				for offset in [-130.0, 0.0, 130.0]:
					_drop_bullet(Vector2(global_position.x + offset, 250.0))
		3:
			velocity.x = 0.0
			if shot_timer <= 0.0:
				shot_timer = 0.85
				for angle in [-0.36, -0.18, 0.0, 0.18, 0.36]:
					_fire_direction(Vector2(float(facing), angle).normalized(), 300.0)

	if pattern_timer <= 0.0:
		pattern_index = (pattern_index + 1) % 4
		_start_pattern()

func _start_pattern() -> void:
	local_timer = 0.0
	shot_timer = 0.08
	pattern_timer = 2.4
	if pattern_index == 1:
		pattern_timer = 1.45

func _fire_at(target_position: Vector2, bullet_speed: float) -> void:
	_fire_direction((target_position - muzzle.global_position).normalized(), bullet_speed)

func _fire_direction(direction: Vector2, bullet_speed: float) -> void:
	var bullet = EnemyBullet.instantiate()
	bullet.global_position = muzzle.global_position
	bullet.call("setup", direction)
	bullet.set("speed", bullet_speed)
	get_tree().current_scene.add_child(bullet)

func _drop_bullet(start_position: Vector2) -> void:
	var bullet = EnemyBullet.instantiate()
	bullet.global_position = start_position
	bullet.call("setup", Vector2.DOWN)
	bullet.set("speed", 280.0)
	get_tree().current_scene.add_child(bullet)

func take_damage(amount: int, _from_position: Vector2) -> void:
	if defeated_flag:
		return
	hp = maxi(0, hp - amount)
	flash_timer = 0.09
	if visual.has_method("flash"):
		visual.call("flash")
	hp_changed.emit(hp, max_hp)
	if hp == 0:
		defeated_flag = true
		active = false
		velocity = Vector2.ZERO
		_spawn_explosion()
		_play_sound("play_enemy_down")
		defeated.emit()
		queue_free()

func _spawn_explosion() -> void:
	for offset in [Vector2.ZERO, Vector2(-36, -28), Vector2(38, 20), Vector2(0, -54)]:
		var explosion := ExplosionScene.instantiate()
		explosion.global_position = global_position + offset
		get_tree().current_scene.add_child(explosion)

func _update_visual() -> void:
	if visual.has_method("set_state"):
		var state := "idle"
		if active and pattern_index == 1:
			state = "jump"
		elif active and pattern_index in [0, 2, 3]:
			state = "shoot"
		visual.call("set_state", state)
		visual.call("set_facing", facing)

func _play_sound(method_name: String) -> void:
	var sound := get_tree().get_first_node_in_group("sound_manager")
	if sound != null and sound.has_method(method_name):
		sound.call(method_name)
