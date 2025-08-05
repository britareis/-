// Игровые переменные
let gameState = {
  day: 1,
  money: 2150,
  xp: 0,
  energy: 80,
  health: 100,
  hunger: 30,
  burnout: 15,
  relationshipLevel: 0,
  hasPartner: false,
  partnerName: '',
  ownedItems: [],
  clients: [],
  activeTab: 'housing'
};

// Данные для генерации клиентов
const clientTypes = [
  {
    name: 'Начинающий блогер',
    emojis: ['📱', '🤳', '💄'],
    budget: [500, 2000],
    difficulty: 1,
    descriptions: [
      'Хочет снять первое видео для TikTok',
      'Нужна помощь с монтажом для YouTube',
      'Мечтает стать инфлюенсером'
    ]
  },
  {
    name: 'Свадебная пара',
    emojis: ['💒', '👰', '🤵'],
    budget: [5000, 25000],
    difficulty: 2,
    descriptions: [
      'Планируют свадьбу мечты',
      'Нужен видеограф на торжество',
      'Хотят создать красивый фильм'
    ]
  },
  {
    name: 'Местный бизнес',
    emojis: ['🏪', '🍕', '✂️'],
    budget: [3000, 15000],
    difficulty: 2,
    descriptions: [
      'Нужна реклама для салона красоты',
      'Хотят снять ролик о пиццерии',
      'Продвигают новый магазин'
    ]
  },
  {
    name: 'Музыкант',
    emojis: ['🎸', '🎤', '🎵'],
    budget: [2000, 10000],
    difficulty: 3,
    descriptions: [
      'Записывает первый клип',
      'Нужен креативный видеоряд',
      'Мечтает о популярности'
    ]
  }
];

// Тексты для разных состояний
const statusTexts = {
  burnout: {
    0: 'Полон энтузиазма и идей!',
    20: 'Начинаешь понимать, что всё не так просто...',
    40: 'Постоянные отказы начинают давить',
    60: 'Хочется всё бросить и уехать к бабушке в деревню',
    80: 'Каждый день как пытка. Зачем я выбрал эту профессию?',
    100: 'Полное выгорание. Ничего не хочется делать'
  },
  hunger: {
    0: 'Сыт и доволен жизнью',
    20: 'Лёгкий голод, но пока терпимо',
    40: 'Желудок требует нормальной еды',
    60: 'Опять дошик... Когда это закончится?',
    80: 'Мечтаешь о нормальном обеде',
    100: 'Готов продать душу за борщ с мясом'
  },
  energy: {
    0: 'Силы на исходе, нужен отдых',
    20: 'Еле держишься на ногах',
    40: 'Усталость накапливается',
    60: 'Ещё можешь работать, но не долго',
    80: 'Чувствуешь себя бодро',
    100: 'Готов свернуть горы!'
  },
  health: {
    0: 'Критическое состояние, нужен врач!',
    20: 'Здоровье серьёзно пошатнулось',
    40: 'Частые недомогания беспокоят',
    60: 'Иногда болит голова, но в целом норма',
    80: 'Чувствуешь себя хорошо',
    100: 'Здоров как бык!'
  },
  money: {
    low: 'На карте копейки, надо что-то делать...',
    medium: 'Хватает на самое необходимое',
    high: 'Можешь позволить себе небольшие радости',
    rich: 'Деньги есть, можно планировать будущее'
  }
};

// Предметы в магазине
const storeItems = {
  // Жильё
  room: { name: 'Комната в общаге', price: 20000, category: 'housing', effects: { energy: 10, burnout: -5 } },
  studio: { name: 'Студия на окраине', price: 45000, category: 'housing', effects: { energy: 20, burnout: -10, health: 5 } },
  apartment: { name: 'Однушка в спальном районе', price: 80000, category: 'housing', effects: { energy: 30, burnout: -15, health: 10 } },
  penthouse: { name: 'Пентхаус в центре', price: 500000, category: 'housing', effects: { energy: 50, burnout: -25, health: 20 } },
  
  // Транспорт
  bicycle: { name: 'Велосипед', price: 15000, category: 'transport', effects: { health: 10, energy: 5 } },
  scooter: { name: 'Скутер', price: 35000, category: 'transport', effects: { energy: 10 } },
  car: { name: 'Подержанная машина', price: 150000, category: 'transport', effects: { energy: 15, burnout: -5 } },
  newCar: { name: 'Новая машина', price: 800000, category: 'transport', effects: { energy: 25, burnout: -10, health: 5 } },
  
  // Техника
  phone: { name: 'Нормальный телефон', price: 25000, category: 'tech', effects: { xp: 5 } },
  laptop: { name: 'Ноутбук для работы', price: 60000, category: 'tech', effects: { xp: 15, energy: 5 } },
  camera: { name: 'Профессиональная камера', price: 120000, category: 'tech', effects: { xp: 25, money: 100 } },
  studio_eq: { name: 'Студийное оборудование', price: 300000, category: 'tech', effects: { xp: 50, money: 300 } }
};

// Инициализация игры
function initGame() {
  console.log('Игра инициализируется...');
  updateDisplay();
  generateRandomClient();
  
  // Запуск игрового цикла
  setInterval(gameLoop, 30000); // каждые 30 секунд
  console.log('Игра запущена!');
}

// Основной игровой цикл
function gameLoop() {
  // Постепенное изменение состояний
  gameState.hunger = Math.min(100, gameState.hunger + Math.random() * 5);
  gameState.energy = Math.max(0, gameState.energy - Math.random() * 3);
  
  // Случайные события
  if (Math.random() < 0.1) {
    triggerRandomEvent();
  }
  
  updateDisplay();
  checkCriticalStates();
}

// Обновление отображения
function updateDisplay() {
  // Обновляем счетчики
  document.getElementById('day-counter').textContent = gameState.day;
  document.getElementById('money').textContent = gameState.money.toLocaleString() + '₽';
  document.getElementById('xp').textContent = gameState.xp;
  
  // Обновляем полоски состояния
  updateStatBar('burnout', gameState.burnout);
  updateStatBar('hunger', gameState.hunger);
  updateStatBar('energy', gameState.energy);
  updateStatBar('health', gameState.health);
  
  // Обновляем тексты состояний
  updateStatusTexts();
  
  // Обновляем статус отношений
  updateRelationshipStatus();
  
  // Обновляем магазин
  updateStoreItems();
}

// Обновление полоски состояния
function updateStatBar(stat, value) {
  const bar = document.getElementById(stat + '-bar');
  if (bar) {
    bar.style.width = value + '%';
  }
}

// Обновление текстов состояний
function updateStatusTexts() {
  const burnoutText = getStatusText('burnout', gameState.burnout);
  const hungerText = getStatusText('hunger', gameState.hunger);
  const energyText = getStatusText('energy', gameState.energy);
  const healthText = getStatusText('health', gameState.health);
  
  document.getElementById('burnout-text').textContent = burnoutText;
  document.getElementById('hunger-text').textContent = hungerText;
  document.getElementById('energy-text').textContent = energyText;
  document.getElementById('health-text').textContent = healthText;
  
  // XP текст
  const xpTexts = [
    'Каждый отказ — это опыт',
    'Начинаешь понимать индустрию',
    'Появляются первые навыки',
    'Чувствуешь себя увереннее',
    'Уже не новичок в деле',
    'Профессионал своего дела'
  ];
  const xpIndex = Math.min(Math.floor(gameState.xp / 20), xpTexts.length - 1);
  document.getElementById('xp-text').textContent = xpTexts[xpIndex];
}

// Получение текста статуса
function getStatusText(type, value) {
  const texts = statusTexts[type];
  const keys = Object.keys(texts).map(Number).sort((a, b) => a - b);
  
  for (let i = keys.length - 1; i >= 0; i--) {
    if (value >= keys[i]) {
      return texts[keys[i]];
    }
  }
  return texts[keys[0]];
}

// Обновление статуса отношений
function updateRelationshipStatus() {
  const relationshipStatus = document.getElementById('relationship-status');
  if (gameState.hasPartner) {
    relationshipStatus.style.display = 'block';
    document.getElementById('relationship-text').textContent = `С ${gameState.partnerName}`;
    document.getElementById('relationship-meter').style.display = 'block';
    document.getElementById('relationship-bar').style.width = gameState.relationshipLevel + '%';
  }
}

// Обновление предметов в магазине
function updateStoreItems() {
  const storeItems = document.querySelectorAll('.store-item');
  storeItems.forEach(item => {
    const itemId = item.getAttribute('data-item');
    if (gameState.ownedItems.includes(itemId)) {
      if (!item.querySelector('.owned-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'owned-indicator';
        indicator.textContent = 'Куплено';
        item.appendChild(indicator);
      }
      const button = item.querySelector('.btn');
      button.disabled = true;
      button.textContent = 'Уже есть';
      button.classList.add('btn-disabled');
    }
  });
}

// Поиск клиентов
function searchClient() {
  if (gameState.energy < 10) {
    showNotification('Слишком устал для поиска клиентов', 'error');
    return;
  }
  
  gameState.energy -= 10;
  gameState.burnout += 5;
  
  if (Math.random() < 0.3) {
    generateRandomClient();
    showNotification('Нашёл потенциального клиента!', 'success');
  } else {
    showNotification('Никто не отвечает... Может, попробовать ещё раз?', 'error');
  }
  
  updateDisplay();
}

// Генерация случайного клиента
function generateRandomClient() {
  const clientType = clientTypes[Math.floor(Math.random() * clientTypes.length)];
  const budget = Math.floor(Math.random() * (clientType.budget[1] - clientType.budget[0]) + clientType.budget[0]);
  const emoji = clientType.emojis[Math.floor(Math.random() * clientType.emojis.length)];
  const description = clientType.descriptions[Math.floor(Math.random() * clientType.descriptions.length)];
  
  const client = {
    id: Date.now(),
    name: clientType.name,
    emoji: emoji,
    description: description,
    budget: budget,
    difficulty: clientType.difficulty
  };
  
  gameState.clients.push(client);
  displayClients();
}

// Отображение клиентов
function displayClients() {
  const clientsContainer = document.getElementById('clients');
  clientsContainer.innerHTML = '';
  
  gameState.clients.forEach(client => {
    const clientCard = document.createElement('div');
    clientCard.className = 'client-card';
    clientCard.innerHTML = `
      <div class="client-header">${client.emoji} ${client.name}</div>
      <div class="client-stats">
        <div class="client-stat">Бюджет: <strong>${client.budget.toLocaleString()}₽</strong></div>
        <div class="client-stat">Сложность: <strong>${'⭐'.repeat(client.difficulty)}</strong></div>
      </div>
      <div style="color: #aaa; margin-bottom: 1rem;">${client.description}</div>
      <button class="btn" onclick="takeProject(${client.id})">Взяться за проект</button>
    `;
    clientsContainer.appendChild(clientCard);
  });
}

// Взяться за проект
function takeProject(clientId) {
  const client = gameState.clients.find(c => c.id === clientId);
  if (!client) return;
  
  if (gameState.energy < 20) {
    showNotification('Недостаточно энергии для работы', 'error');
    return;
  }
  
  gameState.energy -= 20;
  gameState.burnout += client.difficulty * 5;
  
  // Расчёт успеха проекта
  const successChance = Math.max(0.1, (gameState.xp / 100) + (gameState.energy / 100) - (gameState.burnout / 100));
  const success = Math.random() < successChance;
  
  if (success) {
    gameState.money += client.budget;
    gameState.xp += client.difficulty * 10;
    showNotification(`Проект завершён! Получено ${client.budget.toLocaleString()}₽`, 'success');
  } else {
    gameState.xp += client.difficulty * 2;
    showNotification('Проект провален... Но опыт получен', 'error');
  }
  
  // Удаляем клиента из списка
  gameState.clients = gameState.clients.filter(c => c.id !== clientId);
  displayClients();
  updateDisplay();
}

// Доставка еды
function doDelivery() {
  if (gameState.energy < 15) {
    showNotification('Слишком устал для доставки', 'error');
    return;
  }
  
  gameState.energy -= 15;
  gameState.health -= 2;
  const earnings = Math.floor(Math.random() * 800) + 400;
  gameState.money += earnings;
  
  showNotification(`Отработал смену. Заработал ${earnings}₽`, 'success');
  updateDisplay();
}

// Поиск любви
function findLove() {
  if (gameState.hasPartner) {
    // Развитие отношений
    gameState.relationshipLevel = Math.min(100, gameState.relationshipLevel + 10);
    gameState.energy += 5;
    gameState.burnout -= 3;
    showNotification(`Провёл время с ${gameState.partnerName}. Отношения крепнут!`, 'success');
  } else {
    if (Math.random() < 0.2) {
      const names = ['Анна', 'Мария', 'Елена', 'Дарья', 'Алексей', 'Дмитрий', 'Иван', 'Никита'];
      gameState.partnerName = names[Math.floor(Math.random() * names.length)];
      gameState.hasPartner = true;
      gameState.relationshipLevel = 10;
      showNotification(`Познакомился с ${gameState.partnerName}!`, 'success');
    } else {
      showNotification('Никого интересного не встретил...', 'error');
    }
  }
  updateDisplay();
}

// Отдых
function restAndRecover() {
  gameState.energy = Math.min(100, gameState.energy + 30);
  gameState.burnout = Math.max(0, gameState.burnout - 15);
  gameState.hunger += 10;
  
  showNotification('Хорошо отдохнул и восстановил силы', 'success');
  updateDisplay();
}

// Показать меню еды
function showFoodMenu() {
  const foods = [
    { name: 'Дошик', price: 50, hunger: -20, health: -1 },
    { name: 'Бургер', price: 200, hunger: -40, health: -2 },
    { name: 'Домашняя еда', price: 400, hunger: -60, health: 5 },
    { name: 'Ресторан', price: 1500, hunger: -80, health: 10, energy: 5 }
  ];
  
  let menuText = 'Что будешь есть?\n\n';
  foods.forEach((food, index) => {
    menuText += `${index + 1}. ${food.name} - ${food.price}₽\n`;
  });
  
  const choice = prompt(menuText + '\nВведи номер (1-4):');
  const foodIndex = parseInt(choice) - 1;
  
  if (foodIndex >= 0 && foodIndex < foods.length) {
    const food = foods[foodIndex];
    if (gameState.money >= food.price) {
      gameState.money -= food.price;
      gameState.hunger = Math.max(0, gameState.hunger + food.hunger);
      gameState.health += food.health || 0;
      gameState.energy += food.energy || 0;
      
      showNotification(`Поел ${food.name}. Потратил ${food.price}₽`, 'success');
      updateDisplay();
    } else {
      showNotification('Недостаточно денег!', 'error');
    }
  }
}

// Спорт
function workout() {
  if (gameState.energy < 10) {
    showNotification('Слишком устал для спорта', 'error');
    return;
  }
  
  gameState.energy -= 10;
  gameState.health += 5;
  gameState.hunger += 10;
  gameState.burnout -= 5;
  
  showNotification('Хорошая тренировка! Здоровье улучшилось', 'success');
  updateDisplay();
}

// Универ
function goToUniversity() {
  if (gameState.energy < 15) {
    showNotification('Слишком устал для учёбы', 'error');
    return;
  }
  
  gameState.energy -= 15;
  gameState.xp += 5;
  gameState.money -= 100; // плата за проезд и материалы
  
  showNotification('Посетил лекции. Получил новые знания!', 'success');
  updateDisplay();
}

// Больница
function goToHospital() {
  if (gameState.money < 500) {
    showNotification('Недостаточно денег на врача', 'error');
    return;
  }
  
  gameState.money -= 500;
  gameState.health = Math.min(100, gameState.health + 20);
  
  showNotification('Прошёл обследование. Здоровье улучшилось!', 'success');
  updateDisplay();
}

// Покупка предмета
function buyItem(itemId) {
  const item = storeItems[itemId];
  if (!item) return;
  
  if (gameState.money < item.price) {
    showNotification('Недостаточно денег!', 'error');
    return;
  }
  
  if (gameState.ownedItems.includes(itemId)) {
    showNotification('У тебя уже есть это!', 'error');
    return;
  }
  
  gameState.money -= item.price;
  gameState.ownedItems.push(itemId);
  
  // Применяем эффекты предмета
  Object.keys(item.effects).forEach(effect => {
    if (effect === 'money') {
      // Пассивный доход
      setInterval(() => {
        gameState.money += item.effects.money;
      }, 60000); // каждую минуту
    } else {
      gameState[effect] = Math.max(0, Math.min(100, gameState[effect] + item.effects[effect]));
    }
  });
  
  showNotification(`Купил ${item.name}!`, 'success');
  updateDisplay();
}

// Переключение вкладок
function switchTab(tabName) {
  // Скрываем все вкладки
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Убираем активный класс с кнопок
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Показываем нужную вкладку
  const tab = document.getElementById(tabName + '-tab');
  if (tab) {
    tab.classList.add('active');
  }
  
  // Активируем кнопку
  event.target.classList.add('active');
  
  gameState.activeTab = tabName;
}

// Показать уведомление
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Случайные события
function triggerRandomEvent() {
  const events = [
    {
      emoji: '💸',
      title: 'Неожиданные расходы',
      description: 'Сломался телефон, пришлось потратиться на ремонт',
      effects: { money: -500 }
    },
    {
      emoji: '🎉',
      title: 'Удачный день!',
      description: 'Нашёл деньги в старой куртке',
      effects: { money: 200, energy: 5 }
    },
    {
      emoji: '😷',
      title: 'Плохое самочувствие',
      description: 'Что-то подхватил... Нужно беречь здоровье',
      effects: { health: -10, energy: -5 }
    }
  ];
  
  const event = events[Math.floor(Math.random() * events.length)];
  showEventModal(event);
  
  Object.keys(event.effects).forEach(effect => {
    gameState[effect] = Math.max(0, gameState[effect] + event.effects[effect]);
  });
}

// Показать модальное окно события
function showEventModal(event) {
  document.getElementById('event-emoji').textContent = event.emoji;
  document.getElementById('event-title').textContent = event.title;
  document.getElementById('event-description').textContent = event.description;
  document.getElementById('event-modal').classList.add('show');
}

// Закрыть модальное окно события
function closeEventModal() {
  document.getElementById('event-modal').classList.remove('show');
}

// Проверка критических состояний
function checkCriticalStates() {
  if (gameState.health <= 0) {
    alert('Игра окончена! Здоровье на нуле.');
    location.reload();
  }
  
  if (gameState.money < -5000) {
    alert('Игра окончена! Долги поглотили тебя.');
    location.reload();
  }
}