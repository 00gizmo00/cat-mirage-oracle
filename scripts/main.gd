extends Node

@onready var stage = $Stage01
@onready var hud = $HUD

var finished := false

func _ready() -> void:
	stage.hp_changed.connect(hud.set_hp)
	stage.boss_hp_changed.connect(hud.set_boss_hp)
	stage.boss_battle_started.connect(hud.show_boss_bar)
	stage.player_died.connect(_on_player_died)
	stage.level_cleared.connect(_on_level_cleared)
	hud.show_message("")
	hud.hide_boss_bar()
	hud.set_hp(stage.get_player_hp())

func _process(_delta: float) -> void:
	if finished and Input.is_key_pressed(KEY_R):
		get_tree().reload_current_scene()

func _on_player_died() -> void:
	finished = true
	hud.show_message("GAME OVER\nPress R to restart")

func _on_level_cleared() -> void:
	finished = true
	hud.hide_boss_bar()
	hud.show_message("STAGE CLEAR!\nPress R to play again")
