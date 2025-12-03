import 'package:json_annotation/json_annotation.dart';

part 'auth_model.g.dart';

@JsonSerializable()
class LoginRequest {
  final String username;
  final String password;

  LoginRequest({required this.username, required this.password});

  Map<String, dynamic> toJson() => _$LoginRequestToJson(this);
  factory LoginRequest.fromJson(Map<String, dynamic> json) =>
      _$LoginRequestFromJson(json);
}

@JsonSerializable()
class AuthResponse {
  @JsonKey(name: 'access_token')
  final String accessToken;
  
  @JsonKey(name: 'token_type')
  final String tokenType;
  
  final Map<String, dynamic> user;

  AuthResponse({
    required this.accessToken,
    required this.tokenType,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseFromJson(json);
  Map<String, dynamic> toJson() => _$AuthResponseToJson(this);
}

@JsonSerializable()
class User {
  final int id;
  final String username;
  final String email;
  final String? name;
  final String role;
  final bool active;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.name,
    required this.role,
    required this.active,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}

