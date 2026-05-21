extends StaticBody2D

const EnemyBullet := preload("res://scenes/bullets/enemy_bullet.tscn")
const ExplosionScene := preload("res://scenes/effects/explosion.tscn")

@export var max_hp := 4
@export var contact_damage := 1
@export var shoot_interval := 1.25
@export var detection_range := 850.0

@onready var hitbox: Area2D = $Hitbox
@onready var muzzle: Marker2D = $Muzzle
@onready var visual: Sprite2D = $Visual

var hp := max_hp
var shoot_timer := 0.5
var facing := -1

func _ready() -> void:
	add_to_group("enemies")
	hp = max_hp

func _physics_process(delta: float) -> void:
	shoot_timer -= delta
	var player := get_tree().get_first_node_in_group("player") as Node2D
	if player != null:
		var to_player := player.global_position - global_position
		facing = -1 if to_player.x < 0.0 else 1
		muzzle.position.x = 34.0 * facing
		_update_visual()
		if absf(to_player.x) <= detection_range and shoot_timer <= 0.0:
			shoot_timer = shoot_interval
			shoot_at(player.global_position)

	for body in hitbox.get_overlapping_bodies():
		if body.has_method("take_damage") and body.is_in_group("player"):
			body.call("take_damage", contact_damage, global_position)

func shoot_at(target_position: Vector2) -> void:
	var bullet = EnemyBullet.instantiate()
	bullet.global_position = muzzle.global_position
	bullet.call("setup", target_position - muzzle.global_position)
	get_tree().current_scene.add_child(bullet)

func take_damage(amount: int, _from_position: Vector2) -> void:
	hp -= amount
	if hp <= 0:
		_spawn_explosion()
		_play_sound("play_enemy_down")
		queue_free()
	else:
		if visual.has_method("flash"):
			visual.call("flash")

func _update_visual() -> void:
	if visual.has_method("set_state"):
		visual.call("set_state", "shoot")
		visual.call("set_facing", facing)

func _spawn_explosion() -> void:
	var explosion := ExplosionScene.instantiate()
	explosion.global_position = global_position
	get_tree().current_scene.add_child(explosion)

func _play_sound(method_name: String) -> void:
	var sound := get_tree().get_first_node_in_group("sound_manager")
	if sound != null and sound.has_method(method_name):
		sound.call(method_name)
