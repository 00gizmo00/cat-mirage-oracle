extends Sprite2D

@export var placeholder_size := Vector2i(64, 64)
@export var base_color := Color(0.20, 0.55, 1.00)
@export var accent_color := Color(0.10, 0.25, 0.80)
@export var dark_color := Color(0.05, 0.05, 0.08)
@export_enum("player", "walker", "turret", "boss") var placeholder_kind := "player"

var current_state := "idle"
var facing := 1
var invulnerable := false
var flash_timer := 0.0
var charge_ratio := 0.0

func _ready() -> void:
	centered = true
	if texture == null:
		texture = _make_placeholder_texture()

func _process(delta: float) -> void:
	flash_timer = maxf(0.0, flash_timer - delta)
	var state_scale := Vector2.ONE
	var bob := 0.0

	match current_state:
		"run":
			bob = sin(float(Time.get_ticks_msec()) * 0.025) * 3.0
		"jump":
			state_scale = Vector2(0.96, 1.05)
		"hurt":
			state_scale = Vector2(1.05, 0.96)
		"shoot":
			state_scale = Vector2(1.04, 1.0)

	scale = Vector2(float(facing) * absf(state_scale.x), state_scale.y)
	position.y = bob
	visible = not (invulnerable and int(Time.get_ticks_msec() / 90) % 2 == 0)

	if flash_timer > 0.0:
		modulate = Color(1.0, 0.68, 0.68)
	elif charge_ratio >= 1.0:
		modulate = Color(0.72, 1.0, 1.0)
	elif charge_ratio > 0.25:
		modulate = Color(1.0, 0.96, 0.70)
	else:
		modulate = Color.WHITE

func set_state(new_state: String) -> void:
	current_state = new_state

func set_facing(new_facing: int) -> void:
	if new_facing != 0:
		facing = new_facing

func set_invulnerable(enabled: bool) -> void:
	invulnerable = enabled

func set_charge_ratio(new_ratio: float) -> void:
	charge_ratio = clampf(new_ratio, 0.0, 1.0)

func flash() -> void:
	flash_timer = 0.09

func _make_placeholder_texture() -> ImageTexture:
	var image := Image.create(placeholder_size.x, placeholder_size.y, false, Image.FORMAT_RGBA8)
	image.fill(Color(0, 0, 0, 0))
	match placeholder_kind:
		"player":
			_draw_player(image)
		"walker":
			_draw_walker(image)
		"turret":
			_draw_turret(image)
		"boss":
			_draw_boss(image)
		_:
			_fill_rect(image, Rect2i(Vector2i.ZERO, placeholder_size), base_color)
	return ImageTexture.create_from_image(image)

func _draw_player(image: Image) -> void:
	_fill_rect(image, Rect2i(Vector2i(11, 14), Vector2i(42, 44)), base_color)
	_fill_rect(image, Rect2i(Vector2i(20, 4), Vector2i(24, 14)), accent_color)
	_fill_rect(image, Rect2i(Vector2i(42, 26), Vector2i(18, 12)), accent_color)
	_fill_rect(image, Rect2i(Vector2i(16, 54), Vector2i(12, 8)), accent_color)
	_fill_rect(image, Rect2i(Vector2i(36, 54), Vector2i(12, 8)), accent_color)

func _draw_walker(image: Image) -> void:
	_fill_rect(image, Rect2i(Vector2i(11, 17), Vector2i(42, 36)), base_color)
	_fill_rect(image, Rect2i(Vector2i(19, 8), Vector2i(26, 10)), accent_color)
	_fill_rect(image, Rect2i(Vector2i(38, 29), Vector2i(7, 7)), dark_color)
	_fill_rect(image, Rect2i(Vector2i(16, 52), Vector2i(11, 7)), accent_color)
	_fill_rect(image, Rect2i(Vector2i(37, 52), Vector2i(11, 7)), accent_color)

func _draw_turret(image: Image) -> void:
	_fill_rect(image, Rect2i(Vector2i(8, 12), Vector2i(42, 42)), base_color)
	_fill_rect(image, Rect2i(Vector2i(34, 25), Vector2i(28, 14)), accent_color)
	_fill_rect(image, Rect2i(Vector2i(23, 23), Vector2i(16, 16)), Color(0.85, 0.65, 1.0))
	_fill_rect(image, Rect2i(Vector2i(13, 54), Vector2i(36, 6)), dark_color)

func _draw_boss(image: Image) -> void:
	_fill_rect(image, Rect2i(Vector2i(32, 28), Vector2i(96, 112)), base_color)
	_fill_rect(image, Rect2i(Vector2i(46, 8), Vector2i(68, 24)), accent_color)
	_fill_rect(image, Rect2i(Vector2i(14, 58), Vector2i(46, 22)), dark_color)
	_fill_rect(image, Rect2i(Vector2i(50, 122), Vector2i(28, 28)), dark_color)
	_fill_rect(image, Rect2i(Vector2i(94, 122), Vector2i(28, 28)), dark_color)
	_fill_rect(image, Rect2i(Vector2i(48, 62), Vector2i(12, 12)), Color(1.0, 0.9, 0.25))

func _fill_rect(image: Image, rect: Rect2i, color: Color) -> void:
	var left := clampi(rect.position.x, 0, image.get_width())
	var top := clampi(rect.position.y, 0, image.get_height())
	var right := clampi(rect.position.x + rect.size.x, 0, image.get_width())
	var bottom := clampi(rect.position.y + rect.size.y, 0, image.get_height())
	for y in range(top, bottom):
		for x in range(left, right):
			image.set_pixel(x, y, color)
