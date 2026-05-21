extends Area2D

@export var speed := 760.0
@export var damage := 1
@export var lifetime := 1.1

var direction := 1
var charged := false

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func setup(new_direction: int, is_charged := false) -> void:
	direction = int(signf(new_direction))
	if direction == 0:
		direction = 1
	charged = is_charged
	if charged:
		speed = 640.0
		damage = 4
		lifetime = 1.35
		var shape := $CollisionShape2D.shape as RectangleShape2D
		shape.size = Vector2(38, 22)

func _physics_process(delta: float) -> void:
	position.x += speed * direction * delta
	lifetime -= delta
	if lifetime <= 0.0:
		queue_free()

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		return
	if body.has_method("take_damage"):
		body.call("take_damage", damage, global_position)
	queue_free()

func _draw() -> void:
	if charged:
		draw_circle(Vector2.ZERO, 16.0, Color(0.20, 0.90, 1.00))
		draw_circle(Vector2.ZERO, 8.0, Color(1.00, 1.00, 0.75))
	else:
		draw_rect(Rect2(Vector2(-9, -5), Vector2(18, 10)), Color(0.95, 0.90, 0.25))

func _process(_delta: float) -> void:
	queue_redraw()
