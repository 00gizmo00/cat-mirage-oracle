extends Node2D

signal hp_changed(current_hp: int, max_hp: int)
signal boss_hp_changed(current_hp: int, max_hp: int)
signal boss_battle_started
signal player_died
signal level_cleared

const PlayerScene := preload("res://scenes/player/player.tscn")
const WalkerScene := preload("res://scenes/enemies/walker_enemy.tscn")
const TurretScene := preload("res://scenes/enemies/turret_enemy.tscn")
const BossScene := preload("res://scenes/boss/boss.tscn")

var player = null
var boss = null
var boss_door: StaticBody2D = null
var boss_door_visual: Polygon2D = null
var cleared := false
var boss_started := false

func _ready() -> void:
	_build_level()
	_spawn_player()
	_spawn_enemies()
	_spawn_boss()
	_create_boss_room()
	_create_kill_zone()

func get_player_hp() -> Array:
	if player == null:
		return [0, 0]
	return [player.hp, player.max_hp]

func _spawn_player() -> void:
	player = PlayerScene.instantiate()
	player.global_position = Vector2(96, 560)
	add_child(player)
	player.hp_changed.connect(func(current_hp: int, max_hp: int) -> void:
		hp_changed.emit(current_hp, max_hp)
	)
	player.died.connect(func() -> void:
		player_died.emit()
	)

func _spawn_enemies() -> void:
	var walker_a = WalkerScene.instantiate()
	walker_a.global_position = Vector2(460, 590)
	walker_a.set("patrol_left", 330)
	walker_a.set("patrol_right", 620)
	add_child(walker_a)

	var walker_b = WalkerScene.instantiate()
	walker_b.global_position = Vector2(1320, 590)
	walker_b.set("patrol_left", 1120)
	walker_b.set("patrol_right", 1480)
	add_child(walker_b)

	var turret_a = TurretScene.instantiate()
	turret_a.global_position = Vector2(1030, 500)
	add_child(turret_a)

	var turret_b = TurretScene.instantiate()
	turret_b.global_position = Vector2(1840, 420)
	add_child(turret_b)

func _build_level() -> void:
	_create_background()
	_create_platform(Vector2(340, 680), Vector2(680, 100), Color(0.24, 0.27, 0.32))
	_create_platform(Vector2(1180, 680), Vector2(640, 100), Color(0.24, 0.27, 0.32))
	_create_platform(Vector2(1960, 680), Vector2(800, 100), Color(0.24, 0.27, 0.32))
	_create_platform(Vector2(2470, 680), Vector2(420, 100), Color(0.24, 0.27, 0.32))
	_create_platform(Vector2(1070, 555), Vector2(180, 35), Color(0.31, 0.36, 0.43))
	_create_platform(Vector2(1640, 575), Vector2(230, 35), Color(0.31, 0.36, 0.43))
	_create_platform(Vector2(1840, 475), Vector2(180, 35), Color(0.31, 0.36, 0.43))
	_create_platform(Vector2(2140, 555), Vector2(170, 35), Color(0.31, 0.36, 0.43))
	_create_platform(Vector2(20, 440), Vector2(40, 380), Color(0.20, 0.23, 0.28))
	_create_platform(Vector2(1510, 580), Vector2(70, 100), Color(0.20, 0.23, 0.28))
	_create_platform(Vector2(2360, 590), Vector2(60, 80), Color(0.20, 0.23, 0.28))
	_create_platform(Vector2(2600, 470), Vector2(60, 420), Color(0.20, 0.23, 0.28))

func _create_background() -> void:
	var sky := Polygon2D.new()
	sky.color = Color(0.08, 0.10, 0.15)
	sky.polygon = PackedVector2Array([
		Vector2(-300, -300),
		Vector2(2900, -300),
		Vector2(2900, 760),
		Vector2(-300, 760),
	])
	add_child(sky)
	sky.z_index = -20

	for i in range(9):
		var panel := Polygon2D.new()
		panel.color = Color(0.12, 0.14, 0.20)
		var x := 180.0 + i * 290.0
		var h := 180.0 + (i % 3) * 55.0
		panel.polygon = PackedVector2Array([
			Vector2(x, 650),
			Vector2(x + 150, 650),
			Vector2(x + 150, 650 - h),
			Vector2(x, 650 - h),
		])
		add_child(panel)
		panel.z_index = -10

func _create_platform(center: Vector2, size: Vector2, color: Color) -> void:
	var body := StaticBody2D.new()
	body.position = center
	add_child(body)

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = size
	shape.shape = rect
	body.add_child(shape)

	var visual := Polygon2D.new()
	visual.color = color
	visual.polygon = PackedVector2Array([
		Vector2(-size.x / 2.0, -size.y / 2.0),
		Vector2(size.x / 2.0, -size.y / 2.0),
		Vector2(size.x / 2.0, size.y / 2.0),
		Vector2(-size.x / 2.0, size.y / 2.0),
	])
	body.add_child(visual)

func _spawn_boss() -> void:
	boss = BossScene.instantiate()
	boss.global_position = Vector2(2450, 560)
	add_child(boss)
	boss.hp_changed.connect(func(current_hp: int, max_hp: int) -> void:
		boss_hp_changed.emit(current_hp, max_hp)
	)
	boss.defeated.connect(_on_boss_defeated)

func _create_boss_room() -> void:
	_create_boss_start_trigger()
	boss_door = StaticBody2D.new()
	boss_door.name = "BossDoor"
	boss_door.position = Vector2(2175, 500)
	boss_door.set_collision_layer_value(1, false)
	boss_door.set_collision_mask_value(1, false)
	add_child(boss_door)

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(48, 260)
	shape.shape = rect
	boss_door.add_child(shape)
	shape.disabled = true

	boss_door_visual = Polygon2D.new()
	boss_door_visual.visible = false
	boss_door_visual.color = Color(0.55, 0.10, 0.16)
	boss_door_visual.polygon = PackedVector2Array([
		Vector2(-24, -130),
		Vector2(24, -130),
		Vector2(24, 130),
		Vector2(-24, 130),
	])
	boss_door.add_child(boss_door_visual)

func _create_boss_start_trigger() -> void:
	var trigger := Area2D.new()
	trigger.name = "BossStart"
	trigger.position = Vector2(2240, 545)
	add_child(trigger)

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(90, 220)
	shape.shape = rect
	trigger.add_child(shape)

	trigger.body_entered.connect(func(body: Node) -> void:
		if body.is_in_group("player") and not boss_started:
			_start_boss_battle()
	)

func _start_boss_battle() -> void:
	boss_started = true
	if boss_door != null:
		boss_door.set_collision_layer_value(1, true)
		boss_door.set_collision_mask_value(1, true)
		var shape := boss_door.get_child(0) as CollisionShape2D
		shape.disabled = false
	if boss_door_visual != null:
		boss_door_visual.visible = true
	if boss != null:
		boss.call("start_battle")
		boss_hp_changed.emit(boss.get("hp"), boss.get("max_hp"))
	boss_battle_started.emit()

func _on_boss_defeated() -> void:
	if cleared:
		return
	cleared = true
	if player != null:
		if player.has_method("play_victory"):
			player.call("play_victory")
		player.set("controls_enabled", false)
	_play_sound("play_goal")
	level_cleared.emit()

func _create_kill_zone() -> void:
	var kill_zone := Area2D.new()
	kill_zone.name = "KillZone"
	kill_zone.position = Vector2(1280, 900)
	add_child(kill_zone)

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(3100, 120)
	shape.shape = rect
	kill_zone.add_child(shape)

	kill_zone.body_entered.connect(func(body: Node) -> void:
		if body.is_in_group("player") and not cleared:
			get_tree().call_deferred("reload_current_scene")
	)

func _play_sound(method_name: String) -> void:
	var sound := get_tree().get_first_node_in_group("sound_manager")
	if sound != null and sound.has_method(method_name):
		sound.call(method_name)
