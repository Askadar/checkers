export const ru = {
	noLiveGames: 'Идущих игр не найдено',
	Play: 'Играть',
	Tournament: 'Турниры',
	Live: 'Идущие игры',
	Chat: 'Чат',
	matchTypes: ['Русские Безранговые (новичок)', 'Русские Безранговые (интересующийся)', 'Русские Безранговые (профессионал)'],
	andSide: 'играет за ',
	'-1': 'черных',
	'1': 'белых',
	'currentMove': 'Сейчас ход',
	'win-1': 'Черные',
	'win1': 'Белые',
	winPrefix: 'У',
	backToSingleplayer: 'Вернуться на тренировочную доску (оффлайн игра)',
	resetSinglePlayerBoard: 'Сбросить игру',
	opponent: 'Оппонент: ',
	alreadyPlaying: text => 'Вы уже играете в комнате ' + text.slice(1) + '. Переместиться в нее?'
};
export const en = {
	noLiveGames: 'No live games found',
	Play: 'Play',
	Tournament: 'Tournament',
	Live: 'Live',
	Chat: 'Chat',
	matchTypes: ['Russian Without rank (novice)', 'Russian Without rank (interested)', 'Russian Without rank (professional)'],
	backToSingleplayer: 'Back to practise board (offline game)',
	alreadyPlaying: text => 'Already playing in room ' + text.slice(1) + '. Switch to it now?'
};
export default ru;
window.locale = ru;
