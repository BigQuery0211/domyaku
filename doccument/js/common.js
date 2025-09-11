// 共通JavaScript関数

// フォームバリデーション
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'この項目は必須です');
            isValid = false;
        } else {
            clearError(input);
        }
        
        // メールアドレスの形式チェック
        if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            showError(input, '正しいメールアドレスを入力してください');
            isValid = false;
        }
        
        // パスワードの一致チェック
        if (input.type === 'password' && input.name === 'password_confirm') {
            const password = form.querySelector('input[name="password"]');
            if (password && input.value !== password.value) {
                showError(input, 'パスワードが一致しません');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// エラー表示
function showError(input, message) {
    input.classList.add('is-invalid');
    
    // 既存のエラーメッセージを削除
    const existingError = input.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // 新しいエラーメッセージを追加
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

// エラークリア
function clearError(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// メールアドレス形式チェック
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// アラート表示
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.main-content .container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // 5秒後に自動で消す
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// 確認ダイアログ
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// ローディング表示
function showLoading(button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = '処理中...';
}

function hideLoading(button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText;
}

// テーブル行の削除
function deleteRow(button, confirmMessage = '削除してもよろしいですか？') {
    confirmAction(confirmMessage, () => {
        const row = button.closest('tr');
        row.remove();
        showAlert('削除しました', 'success');
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // フォーム送信時のバリデーション
    const forms = document.querySelectorAll('form[data-validate="true"]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form.id)) {
                e.preventDefault();
            }
        });
    });
    
    // リアルタイムバリデーション
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showError(this, 'この項目は必須です');
            } else {
                clearError(this);
            }
        });
    });
    
    // 削除ボタンの確認
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            deleteRow(this);
        });
    });
});

// ワークシート関連の関数
const WorksheetEditor = {
    // 質問を追加
    addQuestion: function(sectionId, questionType = 'text') {
        const questionId = 'question_' + Date.now();
        const questionHtml = this.getQuestionTemplate(questionId, questionType);
        
        const section = document.getElementById(sectionId);
        const questionsContainer = section.querySelector('.questions-container');
        questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
        
        this.updateQuestionNumbers(sectionId);
    },
    
    // 質問テンプレート取得
    getQuestionTemplate: function(questionId, questionType) {
        return `
            <div class="question-item card mb-20" id="${questionId}">
                <div class="card-body">
                    <div class="d-flex justify-between align-center mb-20">
                        <h4>質問</h4>
                        <div class="question-actions gap-10">
                            <select class="form-control" style="width: auto;" onchange="WorksheetEditor.changeQuestionType('${questionId}', this.value)">
                                <option value="text" ${questionType === 'text' ? 'selected' : ''}>テキスト入力</option>
                                <option value="single_choice" ${questionType === 'single_choice' ? 'selected' : ''}>単一選択</option>
                                <option value="multiple_choice" ${questionType === 'multiple_choice' ? 'selected' : ''}>複数選択</option>
                                <option value="scale" ${questionType === 'scale' ? 'selected' : ''}>評価スケール</option>
                            </select>
                            <button type="button" class="btn btn-danger btn-sm" onclick="WorksheetEditor.deleteQuestion('${questionId}')">削除</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">質問文 *</label>
                        <textarea class="form-control" rows="2" placeholder="質問を入力してください" required></textarea>
                    </div>
                    <div class="question-settings">
                        ${this.getQuestionSettings(questionType)}
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox"> 必須回答
                        </label>
                    </div>
                </div>
            </div>
        `;
    },
    
    // 質問設定取得
    getQuestionSettings: function(questionType) {
        switch (questionType) {
            case 'single_choice':
            case 'multiple_choice':
                return `
                    <div class="form-group">
                        <label class="form-label">選択肢</label>
                        <div class="choices-container">
                            <div class="choice-item d-flex gap-10 mb-10">
                                <input type="text" class="form-control" placeholder="選択肢1" />
                                <button type="button" class="btn btn-secondary btn-sm">削除</button>
                            </div>
                            <div class="choice-item d-flex gap-10 mb-10">
                                <input type="text" class="form-control" placeholder="選択肢2" />
                                <button type="button" class="btn btn-secondary btn-sm">削除</button>
                            </div>
                        </div>
                        <button type="button" class="btn btn-outline btn-sm">選択肢を追加</button>
                    </div>
                `;
            case 'scale':
                return `
                    <div class="form-group">
                        <label class="form-label">スケール設定</label>
                        <div class="d-flex gap-20">
                            <div>
                                <label>最小値</label>
                                <input type="number" class="form-control" value="1" style="width: 80px;" />
                            </div>
                            <div>
                                <label>最大値</label>
                                <input type="number" class="form-control" value="5" style="width: 80px;" />
                            </div>
                        </div>
                    </div>
                `;
            default:
                return `
                    <div class="form-group">
                        <label class="form-label">回答形式</label>
                        <select class="form-control">
                            <option value="short">短文回答</option>
                            <option value="long">長文回答</option>
                        </select>
                    </div>
                `;
        }
    },
    
    // 質問タイプ変更
    changeQuestionType: function(questionId, newType) {
        const question = document.getElementById(questionId);
        const settingsContainer = question.querySelector('.question-settings');
        settingsContainer.innerHTML = this.getQuestionSettings(newType);
    },
    
    // 質問削除
    deleteQuestion: function(questionId) {
        confirmAction('この質問を削除してもよろしいですか？', () => {
            document.getElementById(questionId).remove();
            showAlert('質問を削除しました', 'success');
        });
    },
    
    // 質問番号更新
    updateQuestionNumbers: function(sectionId) {
        const section = document.getElementById(sectionId);
        const questions = section.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            const title = question.querySelector('h4');
            title.textContent = `質問 ${index + 1}`;
        });
    }
};
