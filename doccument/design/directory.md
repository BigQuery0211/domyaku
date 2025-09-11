# 📁 シンプルディレクトリ構造

## 🏗️ 3つの特徴対応のプロジェクト構造

```text
domyaku/
├── 📄 manage.py                     # Django管理コマンド
├── 📄 requirements.txt              # Python依存関係
├── 📄 README.md                    # プロジェクト説明
│
├── 📁 config/                      # 設定関連
│   ├── 📄 __init__.py
│   ├── 📄 settings.py              # 基本設定
│   ├── 📄 urls.py                  # メインURL設定
│   └── 📄 wsgi.py                  # WSGI設定
│
├── 📁 apps/                        # アプリケーション
│   ├── 📁 companies/               # 会社管理（特徴①）
│   │   ├── 📄 __init__.py
│   │   ├── 📄 models.py            # Company モデル
│   │   ├── 📄 views.py             # 会社登録・管理ビュー
│   │   ├── 📄 urls.py
│   │   ├── 📄 admin.py
│   │   ├── � migrations/
│   │   ├── � templates/companies/
│   │   │   ├── 📄 registration.html  # 会社登録画面
│   │   │   └── 📄 management.html    # 会社管理画面
│   │   └── 📁 static/companies/
│   │       └── 📁 css/
│   │           └── 📄 company.css
│   │
│   ├── � invitations/             # ユーザー招待（特徴①）
│   │   ├── 📄 __init__.py
│   │   ├── 📄 models.py            # 招待モデル
│   │   ├── � views.py             # 招待・パスワード設定ビュー
│   │   ├── 📄 urls.py
│   │   ├── � email_service.py     # メール送信サービス
│   │   ├── � migrations/
│   │   ├── � templates/invitations/
│   │   │   ├── 📄 invitation_form.html
│   │   │   └── � password_setup.html
│   │   └── 📁 static/invitations/
│   │       └── � css/
│   │           └── 📄 invitation.css
│   │
│   ├── 📁 seminars/                # セミナー・ワークシート管理（特徴②）
│   │   ├── 📄 __init__.py
│   │   ├── 📄 models.py            # セミナー・ワークシート関連モデル
│   │   ├── 📄 views.py             # ビュー（管理画面）
│   │   ├── 📄 urls.py              # URL設定
│   │   ├── 📄 admin.py             # Django管理画面
│   │   ├── � migrations/          # DBマイグレーション
│   │   ├── 📁 templates/seminars/  # テンプレート
│   │   │   ├── 📄 worksheet_list.html      # ワークシート一覧
│   │   │   ├── 📄 worksheet_editor.html    # ワークシート作成・編集
│   │   │   ├── 📄 seminar_list.html        # セミナー一覧
│   │   │   ├── � seminar_form.html        # セミナー作成
│   │   │   └── � seminar_detail.html      # セミナー詳細（ワークシート管理）
│   │   └── � static/seminars/     # 静的ファイル
│   │       ├── 📁 css/
│   │       │   └── 📄 seminar.css
│   │       └── � js/
│   │           └── � worksheet_editor.js
│   │
│   ├── 📁 participants/            # 参加者管理・回答
│   │   ├── 📄 __init__.py
│   │   ├── 📄 models.py            # 参加者・回答モデル
│   │   ├── 📄 views.py             # 参加者ビュー
│   │   ├── 📄 urls.py              # URL設定
│   │   ├── 📄 admin.py             # 管理画面
│   │   ├── 📁 migrations/
│   │   ├── 📁 templates/participants/
│   │   │   ├── 📄 dashboard.html      # 参加者ダッシュボード
│   │   │   └── 📄 worksheet_answer.html # 回答画面
│   │   └── 📁 static/participants/
│   │       ├── 📁 css/
│   │       │   └── 📄 participant.css
│   │       └── 📁 js/
│   │           └── 📄 answer_form.js
│   │
│   ├── 📁 analytics/               # 分析機能（特徴③）
│   │   ├── 📄 __init__.py
│   │   ├── 📄 views.py             # 分析ビュー
│   │   ├── 📄 urls.py
│   │   ├── 📄 exports.py           # CSV出力
│   │   ├── 📁 templates/analytics/
│   │   │   └── 📄 seminar_analysis.html # セミナー分析画面
│   │   └── 📁 static/analytics/
│   │       └── � css/
│   │           └── 📄 analytics.css
│   │
│   └── 📁 users/                   # ユーザー管理
│       ├── 📄 __init__.py
│       ├── 📄 models.py            # UserProfile
│       ├── 📄 views.py             # ログイン・認証ビュー
│       ├── 📄 urls.py
│       ├──  migrations/
│       ├── 📁 templates/users/
│       │   └── 📄 login.html         # ログイン画面
│       └── 📁 static/users/
│           └── � css/
│               └── 📄 auth.css
│
├── 📁 static/                      # 静的ファイル（本番用）
│   ├── � css/
│   │   ├── 📄 bootstrap.min.css
│   │   └── 📄 custom.css           # カスタムスタイル
│   ├── � js/
│   │   ├── 📄 jquery.min.js
│   │   ├── 📄 bootstrap.min.js
│   │   └── 📄 common.js            # 共通JavaScript
│   └── 📁 images/
│       └── 📄 logo.png
│
├── 📁 templates/                   # グローバルテンプレート
│   ├── 📄 base.html                # ベーステンプレート
│   ├── 📄 base_instructor.html     # 講師画面ベース
│   ├── 📄 base_participant.html    # 参加者画面ベース
│   └── � includes/                # インクルードテンプレート
│       ├── 📄 header.html
│       ├── 📄 footer.html
│       └── 📄 navigation.html
│
└── � media/                       # CSVエクスポートファイル
    └── 📁 exports/
        └── 📁 csv/
```

## 🔧 シンプル技術構成

### Django設定
```python
# config/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 3つの特徴対応アプリ
    'apps.companies',      # 特徴① 会社登録・招待
    'apps.invitations',    # 特徴① ユーザー招待・パスワード設定
    'apps.seminars',       # 特徴② ワークシート・セミナー管理
    'apps.participants',   # 参加者管理・回答
    'apps.analytics',      # 特徴③ 分析機能
    'apps.users',          # ユーザー管理
]

# PostgreSQL設定
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'domyaku',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🎮 シンプルなアプリケーション責務

### 📊 companies + invitations アプリ（特徴①）
**責務**: 会社登録→ユーザー招待→パスワード設定でログイン
- 会社の登録・管理
- ユーザー招待機能
- パスワード設定画面

### � seminars アプリ（特徴②）
**責務**: ワークシート作成→セミナー作成→ワークシート追加→共有
- ワークシート作成・編集
- セミナー作成・管理
- ワークシートのメール送信日時設定・共有

### � analytics アプリ（特徴③）
**責務**: 講師がセミナー詳細からワークシート記入率・記入詳細を確認
- 参加者一覧表示
- ワークシート別記入率
- 個別回答詳細表示
- CSV出力機能

### � participants アプリ
**責務**: 参加者の回答機能
- 参加者ダッシュボード
- ワークシート回答
- 回答データ保存

### � users アプリ
**責務**: 基本的なユーザー管理・認証
- ログイン機能
- ユーザープロファイル管理

この構成で3つの特徴を満たすシンプルなアーキテクチャが実現できます。
│
├── 📁 static/                      # 静的ファイル（本番用）
│   ├── 📁 css/
│   │   ├── 📄 bootstrap.min.css
│   │   ├── 📄 custom.css           # カスタムスタイル
│   │   └── 📄 themes/              # テーマファイル
│   ├── 📁 js/
│   │   ├── 📄 jquery.min.js
│   │   ├── 📄 bootstrap.min.js
│   │   ├── 📄 socket.io.min.js
│   │   ├── 📄 common.js            # 共通JavaScript
│   │   └── 📄 libs/                # 外部ライブラリ
│   ├── 📁 images/
│   │   ├── 📄 logo.png
│   │   └── 📄 icons/
│   └── 📁 fonts/
│
├── 📁 templates/                   # グローバルテンプレート
│   ├── 📄 base.html                # ベーステンプレート
│   ├── 📄 base_admin.html          # 管理画面ベース
│   ├── 📄 base_participant.html    # 参加者画面ベース
│   ├── 📁 includes/                # インクルードテンプレート
│   │   ├── 📄 header.html
│   │   ├── 📄 footer.html
│   │   ├── 📄 navigation.html
│   │   └── 📄 messages.html
│   ├── 📁 registration/            # 認証関連
│   │   ├── 📄 login.html
│   │   ├── 📄 logout.html
│   │   └── 📄 password_reset.html
│   └── 📁 errors/                  # エラーページ
│       ├── 📄 404.html
│       ├── 📄 500.html
│       └── 📄 403.html
│
├── 📁 media/                       # ユーザーアップロードファイル
│   ├── 📁 uploads/
│   │   ├── 📁 images/
│   │   └── 📁 documents/
│   └── 📁 exports/                 # エクスポートファイル
│       ├── 📁 csv/
│       └── 📁 pdf/
│
├── 📁 locale/                      # 国際化
│   ├── 📁 ja/
│   │   └── 📁 LC_MESSAGES/
│   │       ├── 📄 django.po
│   │       └── 📄 django.mo
│   └── 📁 en/
│       └── 📁 LC_MESSAGES/
│
├── 📁 logs/                        # ログファイル
│   ├── 📄 django.log
│   ├── 📄 error.log
│   └── 📄 access.log
│
├── 📁 scripts/                     # 運用スクリプト
│   ├── 📄 backup.py                # バックアップスクリプト
│   ├── 📄 deploy.sh                # デプロイスクリプト
│   └── 📄 maintenance.py           # メンテナンス用
│
├── 📁 docs/                        # ドキュメント
│   ├── 📄 api.md                   # API仕様書
│   ├── 📄 deployment.md            # デプロイ手順
│   └── 📄 user_manual.md           # ユーザーマニュアル
│
└── 📁 tests/                       # 統合テスト
    ├── 📄 __init__.py
    ├── 📄 test_integration.py       # 統合テスト
    ├── 📄 test_performance.py       # パフォーマンステスト
    └── 📄 fixtures/                # テストデータ
        ├── 📄 sample_seminars.json
        └── 📄 sample_users.json
```

## 🔧 技術構成

### Django設定構造

#### config/settings/base.py
```python
"""
基本設定
- データベース設定（PostgreSQL）
- Django REST Framework設定
- 共通ミドルウェア
- 国際化設定
"""

INSTALLED_APPS = [
    # Django標準
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # サードパーティ
    'rest_framework',
    'corsheaders',
    'channels',
    
    # 自作アプリ
    'apps.seminars',
    'apps.participants',
    'apps.responses',
    'apps.companies',
    'apps.users',
    'apps.hr',
    'apps.invitations',
    'apps.common',
    'apps.api',
]

# PostgreSQL設定
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'seminar_system'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Django REST Framework設定
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

#### config/settings/development.py
```python
"""
開発環境設定
- デバッグモード有効
- 開発用ミドルウェア
- ホワイトノイズ設定
"""

from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# デバッグツールバー
INSTALLED_APPS += [
    'debug_toolbar',
]

MIDDLEWARE += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]
```

### API構造

#### apps/api/urls.py
```python
"""
API URL統合
バージョニング対応
"""

urlpatterns = [
    path('v1/seminars/', include('apps.seminars.urls')),
    path('v1/participants/', include('apps.participants.urls')),
    path('v1/responses/', include('apps.responses.urls')),
    path('v1/companies/', include('apps.companies.urls')),
    path('v1/users/', include('apps.users.urls')),
    path('v1/hr/', include('apps.hr.urls')),
    path('v1/invitations/', include('apps.invitations.urls')),
]
```

### フロントエンド構造

#### 主要JavaScriptファイル

**apps/seminars/static/seminars/js/worksheet_editor.js**
```javascript
/**
 * Googleフォームライクなワークシートエディター
 * - ドラッグ&ドロップ機能
 * - リアルタイム保存
 * - プレビュー機能
 */

class WorksheetEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.socket = io('/worksheet');
        this.autoSaveInterval = 1000; // 1秒
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupAutoSave();
        this.setupRealTimeSync();
    }
    
    setupDragAndDrop() {
        // ドラッグ&ドロップ機能の実装
    }
    
    setupAutoSave() {
        // 自動保存機能の実装
    }
    
    setupRealTimeSync() {
        // Socket.ioによるリアルタイム同期
    }
}
```

**apps/participants/static/participants/js/answer_form.js**
```javascript
/**
 * 参加者回答フォーム
 * - 自動保存機能
 * - 進捗表示
 * - バリデーション
 */

class AnswerForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.autoSaveEnabled = true;
        this.init();
    }
    
    init() {
        this.setupAutoSave();
        this.setupValidation();
        this.setupProgressTracking();
    }
}
```

## 🎮 アプリケーション責務分離

### 📊 seminars アプリ
**責務**: セミナー・ワークシート・質問の管理
- セミナーの作成・編集・削除
- ワークシートエディター機能
- 質問・選択肢の管理
- ステータス制御（draft/active/completed）

### 👥 participants アプリ
**責務**: 参加者管理と回答機能
- 参加者登録・管理
- 回答フォーム表示
- 進捗追跡
- ダッシュボード機能

### 📈 responses アプリ
**責務**: 回答データ管理と分析
- 回答データの保存・取得
- データ分析機能
- レポート生成
- エクスポート機能

### 🔧 common アプリ
**責務**: 共通機能・ユーティリティ
- 基底モデル（BaseModel）
- 共通バリデーション
- ユーティリティ関数
- カスタムテンプレートタグ

### 🌐 api アプリ
**責務**: API統合・認証
- API URL統合
- バージョニング
- 認証・権限制御
- CORS設定

## 🔄 データフロー

### 1. ワークシート作成フロー
```text
管理者操作 → seminars/views.py → models.py → PostgreSQL
              ↓
    WebSocket → リアルタイム更新 → 他のユーザー
```

### 2. 参加者回答フロー
```text
参加者入力 → participants/views.py → responses/models.py → PostgreSQL
              ↓
    自動保存 → Ajax → REST API → データベース更新
```

### 3. リアルタイム同期
```text
編集操作 → Socket.io → channels → WebSocket → 他のクライアント
```

## 🚀 デプロイメント構成

### Docker構成
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DEBUG=False
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=seminar_system
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 📱 レスポンシブ対応

### Bootstrap 5 グリッドシステム活用
```html
<!-- 管理画面レイアウト -->
<div class="container-fluid">
    <div class="row">
        <!-- サイドバー -->
        <div class="col-md-3 col-lg-2 sidebar">
            <!-- ナビゲーション -->
        </div>
        
        <!-- メインコンテンツ -->
        <div class="col-md-9 col-lg-10 main-content">
            <!-- ワークシートエディターなど -->
        </div>
    </div>
</div>

<!-- 参加者画面レイアウト -->
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
            <!-- 回答フォーム -->
        </div>
    </div>
</div>
```

この構成により、シンプルな運用ルールを維持しながら、保守性とスケーラビリティを両立したアーキテクチャを実現できます。
