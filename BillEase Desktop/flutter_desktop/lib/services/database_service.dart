import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import 'package:sqflite_common_ffi/sqflite_ffi.dart' as sqflite_ffi;

/// Local SQLite Database Service for Flutter Desktop
/// Can be used for offline data caching or direct database access
class DatabaseService {
  static Database? _database;
  static const String _dbName = 'billease_desktop.db';
  static const int _dbVersion = 1;

  // Initialize database
  static Future<void> initialize() async {
    if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
      sqflite_ffi.sqfliteFfiInit();
      databaseFactory = sqflite_ffi.databaseFactoryFfi;
    }

    final dbPath = await _getDatabasePath();
    _database = await openDatabase(
      dbPath,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  static Future<String> _getDatabasePath() async {
    final directory = await getApplicationDocumentsDirectory();
    return join(directory.path, _dbName);
  }

  static Future<void> _onCreate(Database db, int version) async {
    // Create tables for local caching
    await db.execute('''
      CREATE TABLE IF NOT EXISTS cache_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS offline_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT NOT NULL,
        data TEXT NOT NULL,
        sync_status TEXT DEFAULT 'pending',
        created_at INTEGER NOT NULL
      )
    ''');
  }

  static Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle database migrations
  }

  static Database? get database => _database;

  // Cache operations
  static Future<void> cacheData(String key, String value, {Duration? ttl}) async {
    if (_database == null) await initialize();
    
    final expiresAt = ttl != null 
        ? DateTime.now().add(ttl).millisecondsSinceEpoch 
        : null;
    
    await _database!.insert(
      'cache_data',
      {
        'key': key,
        'value': value,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'expires_at': expiresAt,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  static Future<String?> getCachedData(String key) async {
    if (_database == null) await initialize();
    
    final result = await _database!.query(
      'cache_data',
      where: 'key = ?',
      whereArgs: [key],
    );

    if (result.isEmpty) return null;

    final expiresAt = result.first['expires_at'] as int?;
    if (expiresAt != null && DateTime.now().millisecondsSinceEpoch > expiresAt) {
      await _database!.delete('cache_data', where: 'key = ?', whereArgs: [key]);
      return null;
    }

    return result.first['value'] as String?;
  }

  // Offline data operations
  static Future<void> saveOfflineData(String tableName, Map<String, dynamic> data) async {
    if (_database == null) await initialize();
    
    await _database!.insert(
      'offline_data',
      {
        'table_name': tableName,
        'data': data.toString(), // In production, use JSON encoding
        'sync_status': 'pending',
        'created_at': DateTime.now().millisecondsSinceEpoch,
      },
    );
  }

  static Future<List<Map<String, dynamic>>> getOfflineData(String tableName) async {
    if (_database == null) await initialize();
    
    final result = await _database!.query(
      'offline_data',
      where: 'table_name = ? AND sync_status = ?',
      whereArgs: [tableName, 'pending'],
    );

    return result;
  }

  static Future<void> close() async {
    await _database?.close();
    _database = null;
  }
}

