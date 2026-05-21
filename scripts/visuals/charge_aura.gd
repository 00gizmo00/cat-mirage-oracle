extends Node2D

var charge_ratio := 0.0

func set_charge_ratio(new_ratio: float) -> void:
	charge_ratio = clampf(new_ratio, 0.0, 1.0)
	visible = charge_ratio > 0.08
	queue_redraw()

func _draw() -> void:
	if charge_ratio <= 0.0:
		return
	var color := Color(0.95, 0.90, 0.25)
	var width := 2.0
	if charge_ratio >= 1.0:
		color = Color(0.25, 0.95, 1.0)
		width = 3.0
	var pulse := sin(float(Time.get_ticks_msec()) * 0.02) * 5.0
	draw_arc(Vector2.ZERO, 16.0 + charge_ratio * 12.0 + pulse, 0.0, TAU, 32, color, width)
