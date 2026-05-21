extends CharacterBody2D

const ExplosionScene := preload("res://scenes/effects/explosion.tscn")

@export var max_hp := 3
@export var speed := 85.0
@export var gravity := 1800.0
@export var contact_damage := 1
@export var patrol_left := 0.0
@export var patrol_right := 0.0

@onready var hitbox: Area2D = $Hitbox
@onready var visual: Sprite2D = $Visual

var hp := max_hp
var direction := -1

func _ready() -> void:
	add_to_group("enemies")
	hp = max_hp

func _physics_process(delta: float) -> void:
	velocity.y += gravity * delta
	velocity.x = direction * speed
	move_and_slide()

	if global_position.x <= patrol_left:
		direction = 1
	elif global_position.x >= patrol_right:
		direction = -1
	_update_visual()

	for body in hitbox.get_overlapping_bodies():
		if body.has_method("take_damage") and body.is_in_group("player"):
			body.call("take_damage", contact_damage, global_position)

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
		visual.call("set_state", "run")
		visual.call("set_facing", direction)

func _spawn_explosion() -> void:
	var explosion := ExplosionScene.instantiate()
	explosion.global_position = global_position
	get_tree().current_scene.add_child(explosion)

func _play_sound(method_name: String) -> void:
	var sound := get_tree().get_first_node_in_group("sound_manager")
	if sound != null and sound.has_method(method_name):
		sound.call(method_name)
