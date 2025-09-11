# 🗃️ シンプルデータベース設計

## 📊 3つの特徴対応

### 設計原則
1. **会社登録→ユーザー招待→パスワード設定でログイン**
2. **ワークシート作成→セミナー作成→ワークシート追加→メール送信日時設定→共有**  
3. **事務局がセミナー詳細からワークシート記入率・記入詳細を確認**

## 🏗️ 必要最小限のテーブル

### 1. 受講企業（companies_company）
セミナーを受講する企業の情報管理
```sql
CREATE TABLE companies_company (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,        -- 担当者名
    admin_email VARCHAR(255) NOT NULL,       -- 担当者メールアドレス
    admin_phone VARCHAR(20) NOT NULL,        -- 担当者携帯番号
    notes TEXT,                              -- 備考
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. ユーザー招待（invitations_invitation）
```sql
CREATE TABLE invitations_invitation (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies_company(id),
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,  -- 姓
    last_name VARCHAR(100) NOT NULL,   -- 名
    role VARCHAR(20) DEFAULT 'participant',  -- admin, participant
    invitation_message TEXT,  -- 招待メッセージ（カスタマイズ可能）
    token VARCHAR(255) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. ユーザープロファイル（users_userprofile）
```sql
CREATE TABLE users_userprofile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES auth_user(id),
    company_id INTEGER NOT NULL REFERENCES companies_company(id),  -- 必須フィールドに変更
    role VARCHAR(20) DEFAULT 'participant',  -- admin, participant
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_id)  -- ユーザーと会社の組み合わせは一意
);
```

### 備考：Djangoのauth_userテーブル
Djangoの標準auth_userテーブルには以下のフィールドが含まれています：
- first_name: 姓
- last_name: 名  
- email: メールアドレス
- username: ユーザー名（メールアドレスと同じ値を設定）

### 4. ワークシート（seminars_worksheet）
```sql
CREATE TABLE seminars_worksheet (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_id INTEGER NOT NULL REFERENCES auth_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. セクション（seminars_section）
```sql
CREATE TABLE seminars_section (
    id SERIAL PRIMARY KEY,
    worksheet_id INTEGER NOT NULL REFERENCES seminars_worksheet(id),
    title VARCHAR(255) NOT NULL,
    order_in_worksheet INTEGER NOT NULL
);
```

### 6. 質問（seminars_question）
```sql
CREATE TABLE seminars_question (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES seminars_section(id),
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL,  -- text, single_choice, multiple_choice, scale
    is_required BOOLEAN DEFAULT FALSE,
    order_in_section INTEGER NOT NULL,
    settings JSONB  -- 選択肢、スケール設定など
);
```

### 7. セミナー（seminars_seminar）
```sql
CREATE TABLE seminars_seminar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by_id INTEGER NOT NULL REFERENCES auth_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. セミナーワークシート関連（seminars_seminarworksheet）
```sql
CREATE TABLE seminars_seminarworksheet (
    id SERIAL PRIMARY KEY,
    seminar_id INTEGER NOT NULL REFERENCES seminars_seminar(id),
    worksheet_id INTEGER NOT NULL REFERENCES seminars_worksheet(id),
    order_in_seminar INTEGER NOT NULL,
    email_send_at TIMESTAMP,  -- メール送信日時設定
    is_sent BOOLEAN DEFAULT FALSE,  -- 送信済みフラグ
    sent_at TIMESTAMP  -- 実際の送信日時
);
```

### 9. 参加者（participants_participant）
```sql
CREATE TABLE participants_participant (
    id SERIAL PRIMARY KEY,
    seminar_id INTEGER NOT NULL REFERENCES seminars_seminar(id),
    user_id INTEGER NOT NULL REFERENCES auth_user(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. 回答（responses_response）
```sql
CREATE TABLE responses_response (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER NOT NULL REFERENCES participants_participant(id),
    question_id INTEGER NOT NULL REFERENCES seminars_question(id),
    answer_text TEXT,
    answer_json JSONB,  -- 複数選択やスケール回答用
    is_completed BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔗 リレーションシップ（シンプル）
```text
companies_company → users_userprofile (会社→ユーザー)
companies_company → invitations_invitation (会社→招待)

seminars_worksheet → seminars_section → seminars_question (ワークシート構造)

seminars_seminar → seminars_seminarworksheet → seminars_worksheet (セミナー→ワークシート関連)
seminars_seminar → participants_participant (セミナー→参加者)

participants_participant → responses_response → seminars_question (参加者→回答→質問)
```

## 📊 基本インデックス
```sql
-- 基本的な検索に必要なインデックスのみ
CREATE INDEX idx_invitation_email ON invitations_invitation(email);
CREATE INDEX idx_invitation_token ON invitations_invitation(token);
CREATE INDEX idx_userprofile_company ON users_userprofile(company_id);
CREATE INDEX idx_worksheet_creator ON seminars_worksheet(created_by_id);
CREATE INDEX idx_seminar_creator ON seminars_seminar(created_by_id);
CREATE INDEX idx_response_participant ON responses_response(participant_id);
CREATE INDEX idx_response_question ON responses_response(question_id);
```

この設計で3つの特徴を満たす最小限のデータベースが構築できます。
