import { SupportedLanguage } from '../types';

export interface DictionaryWord {
  word: string;
  translation: string;
  category: string;
  context?: string;
}

export interface LanguageDictionary {
  language: SupportedLanguage;
  words: DictionaryWord[];
}

// Comprehensive dictionary for all supported languages
export const DICTIONARIES: LanguageDictionary[] = [
  // English Dictionary (with translations to all other languages)
  {
    language: SupportedLanguage.English,
    words: [
      // Greetings
      { word: 'Hello', translation: 'Hola', category: 'Greetings', context: 'Casual greeting' },
      { word: 'Good morning', translation: 'Buenos días', category: 'Greetings', context: 'Morning greeting' },
      { word: 'Good afternoon', translation: 'Buenas tardes', category: 'Greetings', context: 'Afternoon greeting' },
      { word: 'Good evening', translation: 'Buenas noches', category: 'Greetings', context: 'Evening greeting' },
      { word: 'Goodbye', translation: 'Adiós', category: 'Greetings', context: 'Farewell' },
      { word: 'Nice to meet you', translation: 'Mucho gusto', category: 'Greetings', context: 'First meeting' },
      { word: 'How are you?', translation: '¿Cómo estás?', category: 'Greetings', context: 'Casual inquiry' },
      { word: 'See you later', translation: 'Hasta luego', category: 'Greetings', context: 'Casual farewell' },
      
      // Common Phrases
      { word: 'Thank you', translation: 'Gracias', category: 'Common', context: 'Expressing gratitude' },
      { word: 'Please', translation: 'Por favor', category: 'Common', context: 'Making a request' },
      { word: 'Yes', translation: 'Sí', category: 'Common', context: 'Affirmative' },
      { word: 'No', translation: 'No', category: 'Common', context: 'Negative' },
      { word: 'Excuse me', translation: 'Disculpe', category: 'Common', context: 'Getting attention' },
      { word: 'I\'m sorry', translation: 'Lo siento', category: 'Common', context: 'Apology' },
      { word: 'No problem', translation: 'No hay problema', category: 'Common', context: 'Reassurance' },
      
      // Questions
      { word: 'How much is this?', translation: '¿Cuánto cuesta?', category: 'Questions', context: 'Shopping' },
      { word: 'Where is the bathroom?', translation: '¿Dónde está el baño?', category: 'Questions', context: 'Asking for directions' },
      { word: 'What time is it?', translation: '¿Qué hora es?', category: 'Questions', context: 'Time inquiry' },
      { word: 'Can you help me?', translation: '¿Puede ayudarme?', category: 'Questions', context: 'Asking for help' },
      { word: 'Do you speak English?', translation: '¿Habla inglés?', category: 'Questions', context: 'Language inquiry' },
      
      // Travel
      { word: 'Airport', translation: 'Aeropuerto', category: 'Travel', context: 'Location' },
      { word: 'Hotel', translation: 'Hotel', category: 'Travel', context: 'Accommodation' },
      { word: 'Taxi', translation: 'Taxi', category: 'Travel', context: 'Transportation' },
      { word: 'Train', translation: 'Tren', category: 'Travel', context: 'Transportation' },
      { word: 'Bus station', translation: 'Estación de autobuses', category: 'Travel', context: 'Transportation' },
      { word: 'Ticket', translation: 'Boleto', category: 'Travel', context: 'Purchase' },
      { word: 'Passport', translation: 'Pasaporte', category: 'Travel', context: 'Document' },
      
      // Food & Dining
      { word: 'Water', translation: 'Agua', category: 'Food', context: 'Drink' },
      { word: 'Food', translation: 'Comida', category: 'Food', context: 'General' },
      { word: 'Restaurant', translation: 'Restaurante', category: 'Food', context: 'Dining location' },
      { word: 'Menu', translation: 'Menú', category: 'Food', context: 'Ordering' },
      { word: 'The bill, please', translation: 'La cuenta, por favor', category: 'Food', context: 'Payment' },
      { word: 'Delicious', translation: 'Delicioso', category: 'Food', context: 'Compliment' },
      
      // Emergency
      { word: 'Help!', translation: '¡Ayuda!', category: 'Emergency', context: 'Calling for help' },
      { word: 'Call the police', translation: 'Llame a la policía', category: 'Emergency', context: 'Police' },
      { word: 'I need a doctor', translation: 'Necesito un médico', category: 'Emergency', context: 'Medical' },
      { word: 'Hospital', translation: 'Hospital', category: 'Emergency', context: 'Medical facility' },
      { word: 'Pharmacy', translation: 'Farmacia', category: 'Emergency', context: 'Medicine' },
    ]
  },
  
  // Spanish Dictionary
  {
    language: SupportedLanguage.Spanish,
    words: [
      // Greetings
      { word: 'Hola', translation: 'Hello', category: 'Greetings' },
      { word: 'Buenos días', translation: 'Good morning', category: 'Greetings' },
      { word: 'Buenas tardes', translation: 'Good afternoon', category: 'Greetings' },
      { word: 'Buenas noches', translation: 'Good evening', category: 'Greetings' },
      { word: 'Adiós', translation: 'Goodbye', category: 'Greetings' },
      { word: 'Mucho gusto', translation: 'Nice to meet you', category: 'Greetings' },
      { word: '¿Cómo estás?', translation: 'How are you?', category: 'Greetings' },
      { word: 'Hasta luego', translation: 'See you later', category: 'Greetings' },
      
      // Common
      { word: 'Gracias', translation: 'Thank you', category: 'Common' },
      { word: 'Por favor', translation: 'Please', category: 'Common' },
      { word: 'Sí', translation: 'Yes', category: 'Common' },
      { word: 'No', translation: 'No', category: 'Common' },
      { word: 'Disculpe', translation: 'Excuse me', category: 'Common' },
      { word: 'Lo siento', translation: 'I\'m sorry', category: 'Common' },
      { word: 'No hay problema', translation: 'No problem', category: 'Common' },
      
      // Questions
      { word: '¿Cuánto cuesta?', translation: 'How much is this?', category: 'Questions' },
      { word: '¿Dónde está el baño?', translation: 'Where is the bathroom?', category: 'Questions' },
      { word: '¿Qué hora es?', translation: 'What time is it?', category: 'Questions' },
      { word: '¿Puede ayudarme?', translation: 'Can you help me?', category: 'Questions' },
      { word: '¿Habla inglés?', translation: 'Do you speak English?', category: 'Questions' },
      
      // Travel
      { word: 'Aeropuerto', translation: 'Airport', category: 'Travel' },
      { word: 'Hotel', translation: 'Hotel', category: 'Travel' },
      { word: 'Taxi', translation: 'Taxi', category: 'Travel' },
      { word: 'Tren', translation: 'Train', category: 'Travel' },
      { word: 'Estación de autobuses', translation: 'Bus station', category: 'Travel' },
      { word: 'Boleto', translation: 'Ticket', category: 'Travel' },
      { word: 'Pasaporte', translation: 'Passport', category: 'Travel' },
      
      // Food
      { word: 'Agua', translation: 'Water', category: 'Food' },
      { word: 'Comida', translation: 'Food', category: 'Food' },
      { word: 'Restaurante', translation: 'Restaurant', category: 'Food' },
      { word: 'Menú', translation: 'Menu', category: 'Food' },
      { word: 'La cuenta', translation: 'The bill', category: 'Food' },
      { word: 'Delicioso', translation: 'Delicious', category: 'Food' },
      
      // Emergency
      { word: '¡Ayuda!', translation: 'Help!', category: 'Emergency' },
      { word: 'Llame a la policía', translation: 'Call the police', category: 'Emergency' },
      { word: 'Necesito un médico', translation: 'I need a doctor', category: 'Emergency' },
      { word: 'Hospital', translation: 'Hospital', category: 'Emergency' },
      { word: 'Farmacia', translation: 'Pharmacy', category: 'Emergency' },
    ]
  },
  
  // Swahili Dictionary
  {
    language: SupportedLanguage.Swahili,
    words: [
      // Greetings
      { word: 'Hujambo', translation: 'Hello', category: 'Greetings', context: 'Casual greeting' },
      { word: 'Jambo', translation: 'Hello', category: 'Greetings', context: 'Formal greeting' },
      { word: 'Asubuhi njema', translation: 'Good morning', category: 'Greetings' },
      { word: 'Mchana njema', translation: 'Good afternoon', category: 'Greetings' },
      { word: 'Jioni njema', translation: 'Good evening', category: 'Greetings' },
      { word: 'Kwaheri', translation: 'Goodbye', category: 'Greetings' },
      { word: 'Tutaonana', translation: 'See you later', category: 'Greetings' },
      { word: 'Shikamoo', translation: 'Greetings (to elders)', category: 'Greetings', context: 'Respectful' },
      
      // Common
      { word: 'Asante', translation: 'Thank you', category: 'Common' },
      { word: 'Tafadhali', translation: 'Please', category: 'Common' },
      { word: 'Ndiyo', translation: 'Yes', category: 'Common' },
      { word: 'Hapana', translation: 'No', category: 'Common' },
      { word: 'Pole', translation: 'I\'m sorry', category: 'Common' },
      { word: 'Hakuna matata', translation: 'No problem', category: 'Common' },
      
      // Questions
      { word: 'Ni kiasi gani?', translation: 'How much?', category: 'Questions' },
      { word: 'Iko wapi?', translation: 'Where is?', category: 'Questions' },
      { word: 'Ni lini?', translation: 'What time?', category: 'Questions' },
      { word: 'Unaweza kusaidia?', translation: 'Can you help?', category: 'Questions' },
      { word: 'Unazungumza Kiingereza?', translation: 'Do you speak English?', category: 'Questions' },
      
      // Travel
      { word: 'Uwanja wa ndege', translation: 'Airport', category: 'Travel' },
      { word: 'Hoteli', translation: 'Hotel', category: 'Travel' },
      { word: 'Taksi', translation: 'Taxi', category: 'Travel' },
      { word: 'Gari la moshi', translation: 'Train', category: 'Travel' },
      { word: 'Stesheni ya basi', translation: 'Bus station', category: 'Travel' },
      { word: 'Tiketi', translation: 'Ticket', category: 'Travel' },
      { word: 'Pasipoti', translation: 'Passport', category: 'Travel' },
      
      // Food
      { word: 'Maji', translation: 'Water', category: 'Food' },
      { word: 'Chakula', translation: 'Food', category: 'Food' },
      { word: 'Mgahawa', translation: 'Restaurant', category: 'Food' },
      { word: 'Menyu', translation: 'Menu', category: 'Food' },
      { word: 'B ill', translation: 'Bill', category: 'Food' },
      { word: 'Mchuzi', translation: 'Delicious', category: 'Food', context: 'Tasty' },
      
      // Emergency
      { word: 'Msaada!', translation: 'Help!', category: 'Emergency' },
      { word: 'Mpolisi', translation: 'Police', category: 'Emergency' },
      { word: 'Daktari', translation: 'Doctor', category: 'Emergency' },
      { word: 'Hospitali', translation: 'Hospital', category: 'Emergency' },
      { word: 'Duka la dawa', translation: 'Pharmacy', category: 'Emergency' },
    ]
  },
  
  // Turkish Dictionary
  {
    language: SupportedLanguage.Turkish,
    words: [
      // Greetings
      { word: 'Merhaba', translation: 'Hello', category: 'Greetings' },
      { word: 'Günaydın', translation: 'Good morning', category: 'Greetings' },
      { word: 'İyi günler', translation: 'Good afternoon', category: 'Greetings' },
      { word: 'İyi akşamlar', translation: 'Good evening', category: 'Greetings' },
      { word: 'Hoşçakal', translation: 'Goodbye', category: 'Greetings' },
      { word: 'Nasılsınız?', translation: 'How are you?', category: 'Greetings' },
      { word: 'Tanıştığımıza memnun oldum', translation: 'Nice to meet you', category: 'Greetings' },
      
      // Common
      { word: 'Teşekkür ederim', translation: 'Thank you', category: 'Common' },
      { word: 'Lütfen', translation: 'Please', category: 'Common' },
      { word: 'Evet', translation: 'Yes', category: 'Common' },
      { word: 'Hayır', translation: 'No', category: 'Common' },
      { word: 'Affedersiniz', translation: 'Excuse me', category: 'Common' },
      { word: 'Üzgünüm', translation: 'I\'m sorry', category: 'Common' },
      { word: 'Sorun yok', translation: 'No problem', category: 'Common' },
      
      // Questions
      { word: 'Bu ne kadar?', translation: 'How much is this?', category: 'Questions' },
      { word: 'Tuvalet nerede?', translation: 'Where is the bathroom?', category: 'Questions' },
      { word: 'Saat kaç?', translation: 'What time is it?', category: 'Questions' },
      { word: 'Yardımcı olabilir misiniz?', translation: 'Can you help me?', category: 'Questions' },
      { word: 'İngilizce biliyor musunuz?', translation: 'Do you speak English?', category: 'Questions' },
      
      // Travel
      { word: 'Havalimanı', translation: 'Airport', category: 'Travel' },
      { word: 'Otel', translation: 'Hotel', category: 'Travel' },
      { word: 'Taksi', translation: 'Taxi', category: 'Travel' },
      { word: 'Tren', translation: 'Train', category: 'Travel' },
      { word: 'Otogar', translation: 'Bus station', category: 'Travel' },
      { word: 'Bilet', translation: 'Ticket', category: 'Travel' },
      { word: 'Pasaport', translation: 'Passport', category: 'Travel' },
      
      // Food
      { word: 'Su', translation: 'Water', category: 'Food' },
      { word: 'Yemek', translation: 'Food', category: 'Food' },
      { word: 'Restoran', translation: 'Restaurant', category: 'Food' },
      { word: 'Menü', translation: 'Menu', category: 'Food' },
      { word: 'Hesap', translation: 'Bill', category: 'Food' },
      { word: 'Lezzetli', translation: 'Delicious', category: 'Food' },
      
      // Emergency
      { word: 'Yardım!', translation: 'Help!', category: 'Emergency' },
      { word: 'Polisi arayın', translation: 'Call the police', category: 'Emergency' },
      { word: 'Doktora ihtiyacım var', translation: 'I need a doctor', category: 'Emergency' },
      { word: 'Hastane', translation: 'Hospital', category: 'Emergency' },
      { word: 'Eczane', translation: 'Pharmacy', category: 'Emergency' },
    ]
  },
  
  // Italian Dictionary
  {
    language: SupportedLanguage.Italian,
    words: [
      // Greetings
      { word: 'Ciao', translation: 'Hello/Goodbye', category: 'Greetings', context: 'Informal' },
      { word: 'Buongiorno', translation: 'Good morning', category: 'Greetings' },
      { word: 'Buon pomeriggio', translation: 'Good afternoon', category: 'Greetings' },
      { word: 'Buonasera', translation: 'Good evening', category: 'Greetings' },
      { word: 'Arrivederci', translation: 'Goodbye', category: 'Greetings' },
      { word: 'Come stai?', translation: 'How are you?', category: 'Greetings' },
      { word: 'Piacere', translation: 'Nice to meet you', category: 'Greetings' },
      
      // Common
      { word: 'Grazie', translation: 'Thank you', category: 'Common' },
      { word: 'Per favore', translation: 'Please', category: 'Common' },
      { word: 'Sì', translation: 'Yes', category: 'Common' },
      { word: 'No', translation: 'No', category: 'Common' },
      { word: 'Mi scusi', translation: 'Excuse me', category: 'Common' },
      { word: 'Mi dispiace', translation: 'I\'m sorry', category: 'Common' },
      { word: 'Nessun problema', translation: 'No problem', category: 'Common' },
      
      // Questions
      { word: 'Quanto costa?', translation: 'How much is this?', category: 'Questions' },
      { word: 'Dov\'è il bagno?', translation: 'Where is the bathroom?', category: 'Questions' },
      { word: 'Che ore sono?', translation: 'What time is it?', category: 'Questions' },
      { word: 'Può aiutarmi?', translation: 'Can you help me?', category: 'Questions' },
      { word: 'Parla inglese?', translation: 'Do you speak English?', category: 'Questions' },
      
      // Travel
      { word: 'Aeroporto', translation: 'Airport', category: 'Travel' },
      { word: 'Albergo', translation: 'Hotel', category: 'Travel' },
      { word: 'Taxi', translation: 'Taxi', category: 'Travel' },
      { word: 'Treno', translation: 'Train', category: 'Travel' },
      { word: 'Stazione degli autobus', translation: 'Bus station', category: 'Travel' },
      { word: 'Biglietto', translation: 'Ticket', category: 'Travel' },
      { word: 'Passaporto', translation: 'Passport', category: 'Travel' },
      
      // Food
      { word: 'Acqua', translation: 'Water', category: 'Food' },
      { word: 'Cibo', translation: 'Food', category: 'Food' },
      { word: 'Ristorante', translation: 'Restaurant', category: 'Food' },
      { word: 'Menù', translation: 'Menu', category: 'Food' },
      { word: 'Il conto', translation: 'The bill', category: 'Food' },
      { word: 'Delizioso', translation: 'Delicious', category: 'Food' },
      
      // Emergency
      { word: 'Aiuto!', translation: 'Help!', category: 'Emergency' },
      { word: 'Chiami la polizia', translation: 'Call the police', category: 'Emergency' },
      { word: 'Ho bisogno di un dottore', translation: 'I need a doctor', category: 'Emergency' },
      { word: 'Ospedale', translation: 'Hospital', category: 'Emergency' },
      { word: 'Farmacia', translation: 'Pharmacy', category: 'Emergency' },
    ]
  },
  
  // German Dictionary
  {
    language: SupportedLanguage.German,
    words: [
      // Greetings
      { word: 'Hallo', translation: 'Hello', category: 'Greetings' },
      { word: 'Guten Morgen', translation: 'Good morning', category: 'Greetings' },
      { word: 'Guten Tag', translation: 'Good day', category: 'Greetings' },
      { word: 'Guten Abend', translation: 'Good evening', category: 'Greetings' },
      { word: 'Auf Wiedersehen', translation: 'Goodbye', category: 'Greetings' },
      { word: 'Tschüss', translation: 'Bye', category: 'Greetings', context: 'Informal' },
      { word: 'Wie geht es Ihnen?', translation: 'How are you?', category: 'Greetings' },
      { word: 'Freut mich', translation: 'Nice to meet you', category: 'Greetings' },
      
      // Common
      { word: 'Danke', translation: 'Thank you', category: 'Common' },
      { word: 'Bitte', translation: 'Please/You\'re welcome', category: 'Common' },
      { word: 'Ja', translation: 'Yes', category: 'Common' },
      { word: 'Nein', translation: 'No', category: 'Common' },
      { word: 'Entschuldigung', translation: 'Excuse me/Sorry', category: 'Common' },
      { word: 'Kein Problem', translation: 'No problem', category: 'Common' },
      
      // Questions
      { word: 'Wie viel kostet das?', translation: 'How much is this?', category: 'Questions' },
      { word: 'Wo ist die Toilette?', translation: 'Where is the bathroom?', category: 'Questions' },
      { word: 'Wie spät ist es?', translation: 'What time is it?', category: 'Questions' },
      { word: 'Können Sie mir helfen?', translation: 'Can you help me?', category: 'Questions' },
      { word: 'Sprechen Sie Englisch?', translation: 'Do you speak English?', category: 'Questions' },
      
      // Travel
      { word: 'Flughafen', translation: 'Airport', category: 'Travel' },
      { word: 'Hotel', translation: 'Hotel', category: 'Travel' },
      { word: 'Taxi', translation: 'Taxi', category: 'Travel' },
      { word: 'Zug', translation: 'Train', category: 'Travel' },
      { word: 'Busbahnhof', translation: 'Bus station', category: 'Travel' },
      { word: 'Fahrkarte', translation: 'Ticket', category: 'Travel' },
      { word: 'Reisepass', translation: 'Passport', category: 'Travel' },
      
      // Food
      { word: 'Wasser', translation: 'Water', category: 'Food' },
      { word: 'Essen', translation: 'Food', category: 'Food' },
      { word: 'Restaurant', translation: 'Restaurant', category: 'Food' },
      { word: 'Speisekarte', translation: 'Menu', category: 'Food' },
      { word: 'Die Rechnung', translation: 'The bill', category: 'Food' },
      { word: 'Lecker', translation: 'Delicious', category: 'Food' },
      
      // Emergency
      { word: 'Hilfe!', translation: 'Help!', category: 'Emergency' },
      { word: 'Rufen Sie die Polizei', translation: 'Call the police', category: 'Emergency' },
      { word: 'Ich brauche einen Arzt', translation: 'I need a doctor', category: 'Emergency' },
      { word: 'Krankenhaus', translation: 'Hospital', category: 'Emergency' },
      { word: 'Apotheke', translation: 'Pharmacy', category: 'Emergency' },
    ]
  },
  
  // Chinese Dictionary
  {
    language: SupportedLanguage.Chinese,
    words: [
      // Greetings
      { word: '你好', translation: 'Hello', category: 'Greetings' },
      { word: '早上好', translation: 'Good morning', category: 'Greetings' },
      { word: '下午好', translation: 'Good afternoon', category: 'Greetings' },
      { word: '晚上好', translation: 'Good evening', category: 'Greetings' },
      { word: '再见', translation: 'Goodbye', category: 'Greetings' },
      { word: '你好吗？', translation: 'How are you?', category: 'Greetings' },
      { word: '很高兴认识你', translation: 'Nice to meet you', category: 'Greetings' },
      
      // Common
      { word: '谢谢', translation: 'Thank you', category: 'Common' },
      { word: '请', translation: 'Please', category: 'Common' },
      { word: '是', translation: 'Yes', category: 'Common' },
      { word: '不', translation: 'No', category: 'Common' },
      { word: '对不起', translation: 'I\'m sorry', category: 'Common' },
      { word: '没关系', translation: 'No problem', category: 'Common' },
      
      // Questions
      { word: '这个多少钱？', translation: 'How much is this?', category: 'Questions' },
      { word: '厕所在哪里？', translation: 'Where is the bathroom?', category: 'Questions' },
      { word: '现在几点？', translation: 'What time is it?', category: 'Questions' },
      { word: '你能帮我吗？', translation: 'Can you help me?', category: 'Questions' },
      { word: '你会说英语吗？', translation: 'Do you speak English?', category: 'Questions' },
      
      // Travel
      { word: '机场', translation: 'Airport', category: 'Travel' },
      { word: '酒店', translation: 'Hotel', category: 'Travel' },
      { word: '出租车', translation: 'Taxi', category: 'Travel' },
      { word: '火车', translation: 'Train', category: 'Travel' },
      { word: '汽车站', translation: 'Bus station', category: 'Travel' },
      { word: '票', translation: 'Ticket', category: 'Travel' },
      { word: '护照', translation: 'Passport', category: 'Travel' },
      
      // Food
      { word: '水', translation: 'Water', category: 'Food' },
      { word: '食物', translation: 'Food', category: 'Food' },
      { word: '餐厅', translation: 'Restaurant', category: 'Food' },
      { word: '菜单', translation: 'Menu', category: 'Food' },
      { word: '账单', translation: 'Bill', category: 'Food' },
      { word: '好吃', translation: 'Delicious', category: 'Food' },
      
      // Emergency
      { word: '救命！', translation: 'Help!', category: 'Emergency' },
      { word: '报警', translation: 'Call the police', category: 'Emergency' },
      { word: '我需要医生', translation: 'I need a doctor', category: 'Emergency' },
      { word: '医院', translation: 'Hospital', category: 'Emergency' },
      { word: '药店', translation: 'Pharmacy', category: 'Emergency' },
    ]
  },
  
  // Korean Dictionary
  {
    language: SupportedLanguage.Korean,
    words: [
      // Greetings
      { word: '안녕하세요', translation: 'Hello', category: 'Greetings', context: 'Formal' },
      { word: '안녕', translation: 'Hello/Bye', category: 'Greetings', context: 'Informal' },
      { word: '좋은 아침', translation: 'Good morning', category: 'Greetings' },
      { word: '좋은 오후', translation: 'Good afternoon', category: 'Greetings' },
      { word: '좋은 저녁', translation: 'Good evening', category: 'Greetings' },
      { word: '안녕히 가세요', translation: 'Goodbye', category: 'Greetings' },
      { word: '어떻게 지내세요?', translation: 'How are you?', category: 'Greetings' },
      { word: '만나서 반갑습니다', translation: 'Nice to meet you', category: 'Greetings' },
      
      // Common
      { word: '감사합니다', translation: 'Thank you', category: 'Common' },
      { word: '부탁합니다', translation: 'Please', category: 'Common' },
      { word: '네', translation: 'Yes', category: 'Common' },
      { word: '아니요', translation: 'No', category: 'Common' },
      { word: '죄송합니다', translation: 'I\'m sorry', category: 'Common' },
      { word: '괜찮아요', translation: 'No problem', category: 'Common' },
      
      // Questions
      { word: '이거 얼마예요?', translation: 'How much is this?', category: 'Questions' },
      { word: '화장실 어디예요?', translation: 'Where is the bathroom?', category: 'Questions' },
      { word: '지금 몇 시예요?', translation: 'What time is it?', category: 'Questions' },
      { word: '도와주실 수 있어요?', translation: 'Can you help me?', category: 'Questions' },
      { word: '영어 할 줄 아세요?', translation: 'Do you speak English?', category: 'Questions' },
      
      // Travel
      { word: '공항', translation: 'Airport', category: 'Travel' },
      { word: '호텔', translation: 'Hotel', category: 'Travel' },
      { word: '택시', translation: 'Taxi', category: 'Travel' },
      { word: '기차', translation: 'Train', category: 'Travel' },
      { word: '버스 정류장', translation: 'Bus station', category: 'Travel' },
      { word: '표', translation: 'Ticket', category: 'Travel' },
      { word: '여권', translation: 'Passport', category: 'Travel' },
      
      // Food
      { word: '물', translation: 'Water', category: 'Food' },
      { word: '음식', translation: 'Food', category: 'Food' },
      { word: '식당', translation: 'Restaurant', category: 'Food' },
      { word: '메뉴', translation: 'Menu', category: 'Food' },
      { word: '계산서', translation: 'Bill', category: 'Food' },
      { word: '맛있어요', translation: 'Delicious', category: 'Food' },
      
      // Emergency
      { word: '도와주세요!', translation: 'Help!', category: 'Emergency' },
      { word: '경찰을 불러주세요', translation: 'Call the police', category: 'Emergency' },
      { word: '의사가 필요해요', translation: 'I need a doctor', category: 'Emergency' },
      { word: '병원', translation: 'Hospital', category: 'Emergency' },
      { word: '약국', translation: 'Pharmacy', category: 'Emergency' },
    ]
  },
];

// Helper function to get dictionary for a language
export function getDictionary(language: SupportedLanguage): DictionaryWord[] {
  const dict = DICTIONARIES.find(d => d.language === language);
  return dict?.words || [];
}

// Helper function to get all categories
export function getCategories(language: SupportedLanguage): string[] {
  const words = getDictionary(language);
  return [...new Set(words.map(w => w.category))];
}

// Helper function to search words
export function searchDictionary(language: SupportedLanguage, query: string): DictionaryWord[] {
  const words = getDictionary(language);
  const lowerQuery = query.toLowerCase();
  return words.filter(w => 
    w.word.toLowerCase().includes(lowerQuery) || 
    w.translation.toLowerCase().includes(lowerQuery)
  );
}

// Helper function to get words by category
export function getWordsByCategory(language: SupportedLanguage, category: string): DictionaryWord[] {
  const words = getDictionary(language);
  return words.filter(w => w.category === category);
}
