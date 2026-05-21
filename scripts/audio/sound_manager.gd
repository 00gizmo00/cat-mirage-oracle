extends Node

const BUS := "Master"

var players: Array[AudioStreamPlayer] = []

func _ready() -> void:
	add_to_group("sound_manager")
	for i in range(8):
		var player := AudioStreamPlayer.new()
		player.bus = BUS
		add_child(player)
		players.append(player)

func play_jump() -> void:
	_play_tone(520.0, 0.07, 0.18)

func play_shot() -> void:
	_play_tone(760.0, 0.05, 0.13)

func play_charge_shot() -> void:
	_play_tone(260.0, 0.10, 0.22)
	_play_tone(980.0, 0.08, 0.16)

func play_hurt() -> void:
	_play_tone(160.0, 0.12, 0.24)

func play_enemy_down() -> void:
	_play_tone(120.0, 0.08, 0.22)
	_play_tone(80.0, 0.12, 0.18)

func play_goal() -> void:
	_play_tone(660.0, 0.09, 0.16)
	_play_tone(880.0, 0.12, 0.14)

func _play_tone(frequency: float, duration: float, volume: float) -> void:
	var player := _get_free_player()
	var stream := AudioStreamGenerator.new()
	stream.mix_rate = 22050.0
	stream.buffer_length = duration + 0.04
	player.stream = stream
	player.volume_db = linear_to_db(volume)
	player.play()
	var playback := player.get_stream_playback() as AudioStreamGeneratorPlayback
	if playback == null:
		return
	var frames := int(stream.mix_rate * duration)
	for i in range(frames):
		var t := float(i) / stream.mix_rate
		var fade := 1.0 - (float(i) / float(frames))
		var sample := sin(TAU * frequency * t) * fade
		playback.push_frame(Vector2(sample, sample))

func _get_free_player() -> AudioStreamPlayer:
	for player in players:
		if not player.playing:
			return player
	return players[0]
