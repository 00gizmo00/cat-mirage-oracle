extends Node2D

@export var lifetime := 0.34
@export var base_radius := 18.0

var age := 0.0

func _process(delta: float) -> void:
	age += delta
	if age >= lifetime:
		queue_free()
	queue_redraw()

func _draw() -> void:
	var t := clampf(age / lifetime, 0.0, 1.0)
	var alpha := 1.0 - t
	draw_circle(Vector2.ZERO, base_radius + 42.0 * t, Color(1.0, 0.35, 0.12, alpha * 0.55))
	draw_circle(Vector2.ZERO, base_radius * (1.0 - t * 0.3), Color(1.0, 0.85, 0.20, alpha))
	for i in range(8):
		var angle := TAU * float(i) / 8.0
		var from := Vector2.RIGHT.rotated(angle) * (8.0 + 18.0 * t)
		var to := Vector2.RIGHT.rotated(angle) * (24.0 + 48.0 * t)
		draw_line(from, to, Color(1.0, 0.75, 0.25, alpha), 3.0)
