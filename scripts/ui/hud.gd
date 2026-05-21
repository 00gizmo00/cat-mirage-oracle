extends CanvasLayer

@onready var hp_label: Label = $Root/HPLabel
@onready var message_panel: ColorRect = $Root/MessagePanel
@onready var message_label: Label = $Root/MessagePanel/MessageLabel
@onready var boss_panel: ColorRect = $Root/BossPanel
@onready var boss_bar_fill: ColorRect = $Root/BossPanel/BossBarBack/BossBarFill

func set_hp(current_hp, max_hp = null) -> void:
	if typeof(current_hp) == TYPE_ARRAY:
		max_hp = current_hp[1]
		current_hp = current_hp[0]
	hp_label.text = "HP: %d / %d" % [current_hp, max_hp]

func show_message(text: String) -> void:
	message_label.text = text
	message_panel.visible = text != ""

func show_boss_bar() -> void:
	boss_panel.visible = true

func hide_boss_bar() -> void:
	boss_panel.visible = false

func set_boss_hp(current_hp: int, max_hp: int) -> void:
	if max_hp <= 0:
		boss_bar_fill.scale.x = 0.0
		return
	boss_bar_fill.scale.x = clampf(float(current_hp) / float(max_hp), 0.0, 1.0)
