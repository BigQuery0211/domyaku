// モック動作用JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // サイドバーのアクティブリンク管理
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // フォームバリデーション（モック）
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('success', '操作が完了しました');
        });
    });

    // ボタンのローディング状態（モック）
    const buttons = document.querySelectorAll('[data-loading]');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading(this);
            setTimeout(() => {
                hideLoading(this);
                showToast('success', '処理が完了しました');
            }, 1500);
        });
    });

    // モーダル制御
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            console.log('Modal opened:', this.id);
        });
    });

    // ドラッグ&ドロップ（簡易版）
    const sortableItems = document.querySelectorAll('.sortable-item');
    sortableItems.forEach(item => {
        item.draggable = true;
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
    });

    // セクション・質問追加機能（モック）
    document.addEventListener('click', function(e) {
        // セクション内の質問追加
        if (e.target.closest('[data-section][data-action="add-question"]')) {
            const btn = e.target.closest('[data-section][data-action="add-question"]');
            const sectionId = btn.dataset.section;
            addQuestionToSection(sectionId);
        }
        
        // セクション編集
        if (e.target.closest('[data-section][data-action="edit-section"]')) {
            const btn = e.target.closest('[data-section][data-action="edit-section"]');
            const sectionId = btn.dataset.section;
            editSection(sectionId);
        }
        
        // 新しいセクション追加
        if (e.target.closest('#addSectionBtn')) {
            addNewSection();
        }
    });

    // 質問削除機能（モック）
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-delete-question]')) {
            deleteQuestion(e.target.closest('.question-item'));
        }
    });

    // 自動保存（モック）
    const autoSaveInputs = document.querySelectorAll('[data-autosave]');
    autoSaveInputs.forEach(input => {
        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                autoSave(this);
            }, 1000);
        });
    });

    // プレビューボタンのイベント
    const previewBtn = document.querySelector('[data-bs-target="#previewModal"]');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            updatePreview();
        });
    }

    // 進捗更新
    updateProgress();
});

// ユーティリティ関数
function showToast(type, message) {
    // Bootstrap Toastの代替として簡易アラート
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

function showLoading(button) {
    const originalText = button.innerHTML;
    button.dataset.originalText = originalText;
    button.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
        処理中...
    `;
    button.disabled = true;
}

function hideLoading(button) {
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
}

// ドラッグ&ドロップ関数
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedElement !== this) {
        const container = this.parentElement;
        const allItems = Array.from(container.children);
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            container.insertBefore(draggedElement, this.nextElementSibling);
        } else {
            container.insertBefore(draggedElement, this);
        }
        showToast('success', '順序を変更しました');
    }
    draggedElement.style.opacity = '1';
    draggedElement = null;
}

// セクション・質問管理関数
function addQuestionToSection(sectionId) {
    const questionId = generateQuestionId(sectionId);
    const sectionContainer = document.querySelector(`#section${sectionId}-questions`);
    
    if (sectionContainer) {
        const questionHtml = createQuestionTemplate(questionId, sectionId);
        sectionContainer.insertAdjacentHTML('beforeend', questionHtml);
        showToast('success', `セクション${sectionId}に質問を追加しました`);
        updatePreview();
    }
}

function editSection(sectionId) {
    const sectionNames = {
        '1': '基本情報',
        '2': '目標設定', 
        '3': '自己評価',
        '4': '今後の計画'
    };
    
    const currentName = sectionNames[sectionId] || `セクション${sectionId}`;
    const newName = prompt(`セクション名を編集してください:`, currentName);
    
    if (newName && newName.trim()) {
        const sectionHeader = document.querySelector(`[data-section="${sectionId}"][data-action="edit-section"]`);
        if (sectionHeader) {
            const titleElement = sectionHeader.closest('.card-header').querySelector('h5');
            const icon = titleElement.querySelector('i');
            titleElement.innerHTML = `${icon.outerHTML}セクション${sectionId}: ${newName.trim()}`;
        }
        showToast('success', 'セクション名を更新しました');
    }
}

function addNewSection() {
    const sectionsCount = document.querySelectorAll('[id^="section"][id$="-questions"]').length;
    const newSectionId = sectionsCount + 1;
    
    const sectionName = prompt('新しいセクション名を入力してください:', `セクション${newSectionId}`);
    
    if (sectionName && sectionName.trim()) {
        const sectionHtml = createSectionTemplate(newSectionId, sectionName.trim());
        const lastSection = document.querySelector('.card:last-of-type');
        lastSection.insertAdjacentHTML('afterend', sectionHtml);
        showToast('success', '新しいセクションを追加しました');
    }
}

function generateQuestionId(sectionId) {
    const sectionQuestions = document.querySelectorAll(`[data-section="${sectionId}"]`);
    return `${sectionId}-${sectionQuestions.length + 1}`;
}

function createQuestionTemplate(questionId, sectionId) {
    return `
        <div class="question-item mb-4" data-question-id="${questionId}" data-section="${sectionId}">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <h6 class="text-primary">質問 ${questionId}</h6>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary" data-action="duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="question-content">
                <div class="mb-3">
                    <label class="form-label">質問タイプ</label>
                    <select class="form-select form-select-sm" onchange="handleQuestionTypeChange(this)">
                        <option value="multiple">選択式（単一回答）</option>
                        <option value="checkbox">選択式（複数回答）</option>
                        <option value="text">記述式</option>
                        <option value="rating">評価スケール（点数）</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">質問文</label>
                    <textarea class="form-control" rows="2" 
                              placeholder="質問内容を入力してください"></textarea>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">補足・ヘルプテキスト</label>
                    <textarea class="form-control" rows="2" 
                              placeholder="質問の補足説明や回答のヒントを入力してください（任意）"></textarea>
                </div>
                
                <div class="question-type-content">
                    <!-- 質問タイプに応じた内容がここに表示される -->
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="required${questionId}">
                            <label class="form-check-label" for="required${questionId}">
                                必須回答
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createSectionTemplate(sectionId, sectionName) {
    const colors = ['primary', 'success', 'warning', 'info', 'danger'];
    const icons = ['info-circle', 'bullseye', 'star', 'calendar-alt', 'cog'];
    const color = colors[(sectionId - 1) % colors.length];
    const icon = icons[(sectionId - 1) % icons.length];
    
    return `
        <div class="card mb-4">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="fas fa-${icon} me-2 text-${color}"></i>セクション${sectionId}: ${sectionName}
                    </h5>
                    <div>
                        <button type="button" class="btn btn-outline-primary btn-sm me-2" data-section="${sectionId}" data-action="add-question">
                            <i class="fas fa-plus me-1"></i>質問追加
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-sm" data-section="${sectionId}" data-action="edit-section">
                            <i class="fas fa-edit me-1"></i>セクション編集
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div id="section${sectionId}-questions">
                    <!-- このセクションの質問がここに表示される -->
                </div>
            </div>
        </div>
    `;
}

function handleQuestionTypeChange(selectElement) {
    const questionItem = selectElement.closest('.question-item');
    const contentContainer = questionItem.querySelector('.question-type-content');
    const selectedType = selectElement.value;
    
    // 質問タイプに応じた内容を生成
    let typeContent = '';
    
    switch (selectedType) {
        case 'multiple':
        case 'checkbox':
            typeContent = createChoicesContent(selectedType);
            break;
        case 'rating':
            typeContent = createRatingContent();
            break;
        case 'text':
        default:
            typeContent = ''; // 記述式は追加設定不要
            break;
    }
    
    contentContainer.innerHTML = typeContent;
    updatePreview();
}

function createChoicesContent(type) {
    const inputType = type === 'multiple' ? 'radio' : 'checkbox';
    const labelText = type === 'multiple' ? '正解' : '選択肢';
    
    return `
        <div class="choices-section">
            <label class="form-label">選択肢</label>
            <div class="choice-item d-flex align-items-center mb-2">
                <div class="form-check me-3">
                    <input class="form-check-input" type="${inputType}" name="choice_${Date.now()}">
                    <label class="form-check-label">${labelText}</label>
                </div>
                <input type="text" class="form-control me-2" placeholder="選択肢を入力">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.closest('.choice-item').remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="choice-item d-flex align-items-center mb-2">
                <div class="form-check me-3">
                    <input class="form-check-input" type="${inputType}" name="choice_${Date.now()}">
                    <label class="form-check-label">${labelText}</label>
                </div>
                <input type="text" class="form-control me-2" placeholder="選択肢を入力">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.closest('.choice-item').remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <button type="button" class="btn btn-outline-primary btn-sm mt-2" onclick="addChoiceOption(this)">
                <i class="fas fa-plus me-1"></i>選択肢を追加
            </button>
        </div>
    `;
}

function createRatingContent() {
    return `
        <div class="rating-settings">
            <label class="form-label">評価設定</label>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label small">最小値</label>
                    <input type="number" class="form-control form-control-sm" value="1" min="0" max="10">
                </div>
                <div class="col-md-6">
                    <label class="form-label small">最大値（満点）</label>
                    <select class="form-select form-select-sm">
                        <option value="3">3点満点</option>
                        <option value="4">4点満点</option>
                        <option value="5" selected>5点満点</option>
                        <option value="7">7点満点</option>
                        <option value="10">10点満点</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label small">最低評価の意味</label>
                    <input type="text" class="form-control form-control-sm" placeholder="例：とても悪い">
                </div>
                <div class="col-md-6">
                    <label class="form-label small">最高評価の意味</label>
                    <input type="text" class="form-control form-control-sm" placeholder="例：とても良い">
                </div>
            </div>
        </div>
    `;
}

function addChoiceOption(button) {
    const choicesSection = button.closest('.choices-section');
    const firstChoice = choicesSection.querySelector('.choice-item');
    const inputType = firstChoice.querySelector('input').type;
    const labelText = firstChoice.querySelector('.form-check-label').textContent;
    
    const newChoice = document.createElement('div');
    newChoice.className = 'choice-item d-flex align-items-center mb-2';
    newChoice.innerHTML = `
        <div class="form-check me-3">
            <input class="form-check-input" type="${inputType}" name="choice_${Date.now()}">
            <label class="form-check-label">${labelText}</label>
        </div>
        <input type="text" class="form-control me-2" placeholder="選択肢を入力">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.closest('.choice-item').remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    button.parentNode.insertBefore(newChoice, button);
}

// 質問管理関数
function addQuestion(type) {
    const questionTypes = {
        'text': createTextQuestion,
        'radio': createRadioQuestion,
        'checkbox': createCheckboxQuestion,
        'scale': createScaleQuestion,
        'textarea': createTextareaQuestion
    };
    
    if (questionTypes[type]) {
        const questionHtml = questionTypes[type]();
        const container = document.querySelector('.questions-container');
        if (container) {
            container.insertAdjacentHTML('beforeend', questionHtml);
            showToast('success', '質問を追加しました');
        }
    }
}

function deleteQuestion(questionElement) {
    if (confirm('この質問を削除しますか？')) {
        questionElement.remove();
        showToast('success', '質問を削除しました');
    }
}

function createTextQuestion() {
    return `
        <div class="question-item sortable-item">
            <div class="question-header d-flex justify-content-between align-items-center">
                <span class="fw-bold">テキスト入力質問</span>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary" data-action="duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" data-delete-question>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="question-content">
                <div class="mb-3">
                    <label class="form-label">質問文</label>
                    <input type="text" class="form-control" placeholder="質問を入力してください" data-autosave>
                </div>
                <div class="mb-3">
                    <label class="form-label">補足・ヘルプテキスト</label>
                    <textarea class="form-control" rows="2" placeholder="質問の補足説明や回答のヒントを入力してください（任意）" data-autosave></textarea>
                </div>
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="required-${Date.now()}">
                        <label class="form-check-label" for="required-${Date.now()}">必須項目</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createRadioQuestion() {
    return `
        <div class="question-item sortable-item">
            <div class="question-header d-flex justify-content-between align-items-center">
                <span class="fw-bold">単一選択質問</span>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary" data-action="duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" data-delete-question>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="question-content">
                <div class="mb-3">
                    <label class="form-label">質問文</label>
                    <input type="text" class="form-control" placeholder="質問を入力してください" data-autosave>
                </div>
                <div class="mb-3">
                    <label class="form-label">補足・ヘルプテキスト</label>
                    <textarea class="form-control" rows="2" placeholder="質問の補足説明や回答のヒントを入力してください（任意）" data-autosave></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">選択肢</label>
                    <div class="options-container">
                        <div class="input-group mb-2">
                            <input type="text" class="form-control" placeholder="選択肢1" data-autosave>
                            <button class="btn btn-outline-secondary" type="button">削除</button>
                        </div>
                        <div class="input-group mb-2">
                            <input type="text" class="form-control" placeholder="選択肢2" data-autosave>
                            <button class="btn btn-outline-secondary" type="button">削除</button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-primary">選択肢を追加</button>
                </div>
            </div>
        </div>
    `;
}

function createCheckboxQuestion() {
    return createRadioQuestion().replace('単一選択質問', '複数選択質問');
}

function createScaleQuestion() {
    return `
        <div class="question-item sortable-item">
            <div class="question-header d-flex justify-content-between align-items-center">
                <span class="fw-bold">評価スケール質問</span>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary" data-action="duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" data-delete-question>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
                </button>
            </div>
            <div class="question-content">
                <div class="mb-3">
                    <label class="form-label">質問文</label>
                    <input type="text" class="form-control" placeholder="質問を入力してください" data-autosave>
                </div>
                <div class="mb-3">
                    <label class="form-label">補足・ヘルプテキスト</label>
                    <textarea class="form-control" rows="2" placeholder="質問の補足説明や回答のヒントを入力してください（任意）" data-autosave></textarea>
                </div>
                <div class="rating-settings">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label small">最小値</label>
                            <input type="number" class="form-control form-control-sm" value="1" min="0" max="10" data-autosave>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small">最大値（満点）</label>
                            <select class="form-select form-select-sm" data-autosave>
                                <option value="3">3点満点</option>
                                <option value="4">4点満点</option>
                                <option value="5" selected>5点満点</option>
                                <option value="7">7点満点</option>
                                <option value="10">10点満点</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label small">最低評価の意味</label>
                            <input type="text" class="form-control form-control-sm" value="とても悪い" placeholder="例：全く思わない" data-autosave>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small">最高評価の意味</label>
                            <input type="text" class="form-control form-control-sm" value="とても良い" placeholder="例：強く思う" data-autosave>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createTextareaQuestion() {
    return createTextQuestion().replace('テキスト入力質問', '長文入力質問');
}

// 自動保存機能
function autoSave(element) {
    const indicator = document.querySelector('.autosave-indicator');
    if (indicator) {
        indicator.innerHTML = '<i class="fas fa-save text-success me-1"></i>保存済み';
        setTimeout(() => {
            indicator.innerHTML = '';
        }, 2000);
    }
    
    // プレビューを更新
    updatePreview();
}

// プレビュー更新機能
function updatePreview() {
    const previewModal = document.querySelector('#previewModal .modal-body');
    if (!previewModal) return;

    // ワークシート基本情報を取得
    const worksheetTitle = document.querySelector('#worksheetTitle')?.value || 'ワークシートタイトル';
    const worksheetSubtitle = document.querySelector('#worksheetSubtitle')?.value || '';
    const worksheetDescription = document.querySelector('#worksheetDescription')?.value || '';

    let previewHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            参加者から見える画面のプレビューです。
        </div>
        
        <div class="text-center mb-4">
            <h4>${worksheetTitle}</h4>
            ${worksheetSubtitle ? `<p class="lead">${worksheetSubtitle}</p>` : ''}
            ${worksheetDescription ? `<p class="text-muted">${worksheetDescription}</p>` : ''}
        </div>
    `;

    // セクションごとに質問を処理
    const sections = document.querySelectorAll('[id^="section"][id$="-questions"]');
    
    sections.forEach((sectionContainer, sectionIndex) => {
        const sectionId = sectionContainer.id.match(/section(\d+)-questions/)?.[1];
        const sectionCard = sectionContainer.closest('.card');
        const sectionTitle = sectionCard.querySelector('h5')?.textContent?.trim() || `セクション${sectionId}`;
        
        const questions = sectionContainer.querySelectorAll('.question-item');
        
        if (questions.length > 0) {
            previewHTML += `
                <div class="answer-section mb-4">
                    <div class="section-divider mb-3">
                        <h5 class="text-primary">${sectionTitle}</h5>
                        <hr>
                    </div>
            `;

            questions.forEach((question, questionIndex) => {
                const questionId = question.dataset.questionId || `${sectionId}-${questionIndex + 1}`;
                const questionText = question.querySelector('textarea, input[type="text"]')?.value || `質問文を入力してください`;
                const helpText = question.querySelectorAll('textarea')[1]?.value || '';
                const questionType = question.querySelector('select')?.value || 'text';
                const isRequired = question.querySelector('input[type="checkbox"]')?.checked || false;

                previewHTML += `
                    <div class="mb-4">
                        <label class="form-label fw-bold">
                            ${questionIndex + 1}. ${questionText}
                            ${isRequired ? '<span class="text-danger">*</span>' : ''}
                        </label>
                        ${helpText ? `
                            <div class="form-text">
                                <i class="fas fa-info-circle me-1"></i>${helpText}
                            </div>
                        ` : ''}
                        ${generatePreviewInput(questionType, question)}
                    </div>
                `;
            });

            previewHTML += '</div>';
        }
    });

    // 質問がない場合のメッセージ
    if (sections.length === 0 || Array.from(sections).every(s => s.querySelectorAll('.question-item').length === 0)) {
        previewHTML += `
            <div class="text-center text-muted py-5">
                <i class="fas fa-question-circle fa-3x mb-3"></i>
                <p>まだ質問が追加されていません。<br>各セクションに質問を追加してプレビューを確認してください。</p>
            </div>
        `;
    } else {
        previewHTML += `
            <div class="text-center mt-4">
                <button type="button" class="btn btn-primary me-2">
                    <i class="fas fa-save me-2"></i>保存
                </button>
                <button type="button" class="btn btn-success">
                    <i class="fas fa-paper-plane me-2"></i>提出
                </button>
            </div>
        `;
    }

    previewModal.innerHTML = previewHTML;
}

// プレビュー用入力要素の生成
function generatePreviewInput(questionType, questionElement = null) {
    switch (questionType) {
        case 'radio':
        case 'multiple':
            // 実際の選択肢を取得
            let choices = ['選択肢1', '選択肢2'];
            if (questionElement) {
                const choiceInputs = questionElement.querySelectorAll('.choice-item input[type="text"]');
                if (choiceInputs.length > 0) {
                    choices = Array.from(choiceInputs)
                        .map(input => input.value || input.placeholder)
                        .filter(text => text && text !== '選択肢を入力');
                }
            }
            
            return choices.map((choice, index) => `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="preview_radio" disabled>
                    <label class="form-check-label">${choice}</label>
                </div>
            `).join('');
            
        case 'checkbox':
            // 実際の選択肢を取得
            let checkboxChoices = ['選択肢1', '選択肢2'];
            if (questionElement) {
                const choiceInputs = questionElement.querySelectorAll('.choice-item input[type="text"]');
                if (choiceInputs.length > 0) {
                    checkboxChoices = Array.from(choiceInputs)
                        .map(input => input.value || input.placeholder)
                        .filter(text => text && text !== '選択肢を入力');
                }
            }
            
            return checkboxChoices.map((choice, index) => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" disabled>
                    <label class="form-check-label">${choice}</label>
                </div>
            `).join('');
            
        case 'rating':
            // 評価スケールの設定を取得
            let minValue = 1;
            let maxValue = 5;
            let minLabel = '低い';
            let maxLabel = '高い';
            
            if (questionElement) {
                const minInput = questionElement.querySelector('input[type="number"]');
                const maxSelect = questionElement.querySelector('.rating-settings select');
                const ratingInputs = questionElement.querySelectorAll('.rating-settings input[type="text"]');
                
                if (minInput) minValue = parseInt(minInput.value) || 1;
                if (maxSelect) maxValue = parseInt(maxSelect.value) || 5;
                if (ratingInputs[0]) minLabel = ratingInputs[0].value || '低い';
                if (ratingInputs[1]) maxLabel = ratingInputs[1].value || '高い';
            }
            
            // スケールオプションを生成
            const scaleOptions = [];
            for (let i = minValue; i <= maxValue; i++) {
                const isFirst = i === minValue;
                const isLast = i === maxValue;
                scaleOptions.push(`
                    <div class="scale-option">
                        <input type="radio" name="preview_scale" disabled>
                        <label>${i}</label>
                        ${isFirst ? `<small>${minLabel}</small>` : ''}
                        ${isLast ? `<small>${maxLabel}</small>` : ''}
                    </div>
                `);
            }
            
            return `
                <div class="question-scale mt-2">
                    ${scaleOptions.join('')}
                </div>
                <style>
                    .question-scale {
                        display: flex;
                        gap: 10px;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    .scale-option {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        min-width: 40px;
                    }
                    .scale-option input {
                        margin-bottom: 5px;
                    }
                    .scale-option small {
                        font-size: 0.75rem;
                        color: #6c757d;
                    }
                </style>
            `;
            
        case 'textarea':
            return `<textarea class="form-control" rows="4" disabled placeholder="回答を入力してください"></textarea>`;
            
        case 'text':
        default:
            return `<input type="text" class="form-control" disabled placeholder="回答を入力してください">`;
    }
}

// 進捗更新
function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        // モック進捗計算
        const totalPages = 16;
        const createdPages = 1; // 現在は index.html のみ
        const percentage = Math.round((createdPages / totalPages) * 100);
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('aria-valuenow', percentage);
        progressBar.textContent = percentage + '%';
    }
}
