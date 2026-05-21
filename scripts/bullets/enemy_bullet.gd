extends Area2D

@export var speed := 360.0
@export var damage := 1
@export var lifetime := 3.0

var direction := Vector2.LEFT

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func setup(new_direction: Vector2) -> void:
	direction = new_direction.normalized()
	if direction == Vector2.ZERO:
		direction = Vector2.LEFT

func _physics_process(delta: float) -> void:
	position += direction * speed * delta
	lifetime -= delta
	if lifetime <= 0.0:
		queue_free()

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("enemies"):
		return
	if body.has_method("take_damage"):
		body.call("take_damage", damage, global_position)
	queue_free()

func _draw() -> void:
	draw_circle(Vector2.ZERO, 8.0, Color(1.0, 0.25, 0.22))

func _process(_delta: float) -> void:
	queue_redraw()
