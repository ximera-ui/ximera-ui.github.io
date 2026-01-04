const fileInput = document.getElementById('upload-file');
const canvas = document.getElementById('editor-canvas');
const ctx = canvas.getContext('2d');
const controlsPanel = document.getElementById('controls-panel');
const uploadPlaceholder = document.getElementById('upload-placeholder');

// Фильтры
const filters = {
    brightness: document.getElementById('brightness'),
    contrast: document.getElementById('contrast'),
    saturation: document.getElementById('saturation'),
    blur: document.getElementById('blur'),
    invert: document.getElementById('invert')
};

let originalImage = new Image();

// 1. Загрузка фото
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        originalImage.src = reader.result;
    };
    reader.readAsDataURL(file);
});

originalImage.onload = () => {
    // Устанавливаем размер канваса под картинку
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // Показываем редактор
    canvas.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
    controlsPanel.classList.remove('disabled');
    
    applyFilters();
};

// 2. Применение эффектов
function applyFilters() {
    // Формируем строку CSS фильтров для канваса
    const filterString = `
        brightness(${filters.brightness.value}%)
        contrast(${filters.contrast.value}%)
        saturate(${filters.saturation.value}%)
        blur(${filters.blur.value}px)
        invert(${filters.invert.value}%)
    `;

    ctx.filter = filterString;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
}

// Слушаем изменения ползунков
Object.values(filters).forEach(input => {
    input.addEventListener('input', applyFilters);
});

// 3. Сброс настроек
document.getElementById('reset-btn').addEventListener('click', () => {
    filters.brightness.value = 100;
    filters.contrast.value = 100;
    filters.saturation.value = 100;
    filters.blur.value = 0;
    filters.invert.value = 0;
    applyFilters();
});

// 4. Скачивание
document.getElementById('save-btn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'nano-banana-edit.png';
    link.href = canvas.toDataURL();
    link.click();
});
