export default {
	"1-A" : {
		"id": '1-A',
		"checker": 2,
		connected: {
			'2': '2-B'
		}
	},
	"1-C" : {
		"id": '1-C',
		"checker": 2,
		connected: {
			'1': '2-B',
			'2': '2-D'
		}
	},
	"1-E" : {
		"id": '1-E',
		"checker": 2,
		connected: {
			'1': '2-D',
			'2': '2-F'
		}
	},
	"1-G" : {
		"id": '1-G',
		"checker": 2,
		connected: {
			2: '2-H',
			1: '2-F'
		}
	},
	"2-B" : {
		"id": '2-B',
		"checker": 0,
		connected: {
			1: '3-A',
			2: '3-C',
			'-1': '1-A',
			'-2': '1-C'
		}
	},
	"2-D" : {
		"id": '2-D',
		"checker": 0,
		connected: {
			2: '3-E',
			1: '3-C',
			'-2': '1-E',
			'-1': '1-C'
		}
	},
	"2-F" : {
		"id": '2-F',
		"checker": 0,
		connected: {
			1: '3-E',
			2: '3-G',
			'-1': '1-E',
			'-2': '1-G'
		}
	},
	"2-H" : {
		"id": '2-H',
		"checker": 0,
		connected: {
			1: '3-G',
			'-1': '1-G'
		}
	},
	"3-A" : {
		"id": '3-A',
		"checker": 0,
		connected: {
			'-2': '2-B',
			'2': '4-B'
		}
	},
	"3-C" : {
		"id": '3-C',
		"checker": 0,
		connected: {
			'-1': '2-B',
			1: '4-B',
			2: '4-D',
			'-2': '2-D'
		}
	},
	"3-E" : {
		"id": '3-E',
		"checker": -1,
		connected: {
			'-2': '2-F',
			2: '4-F',
			1: '4-D',
			'-1': '2-D'
		}
	},
	"3-G" : {
		"id": '3-G',
		"checker": 0,
		connected: {
			'-1': '2-F',
			1: '4-F',
			2: '4-H',
			'-2': '2-H'
		}
	},
	"4-B" : {
		"id": '4-B',
		"checker": 0,
		connected: {
			1: '5-A',
			2: '5-C',
			'-1': '3-A',
			'-2': '3-C'
		}
	},
	"4-D" : {
		"id": '4-D',
		"checker": 0,
		connected: {
			2: '5-E',
			1: '5-C',
			'-2': '3-E',
			'-1': '3-C'
		}
	},
	"4-F" : {
		"id": '4-F',
		"checker": 0,
		connected: {
			1: '5-E',
			2: '5-G',
			'-1': '3-E',
			'-2': '3-G'
		}
	},
	"4-H" : {
		"id": '4-H',
		"checker": 0,
		connected: {
			1: '5-G',
			'-1': '3-G'
		}
	},
	"5-A" : {
		"id": '5-A',
		"checker": 0,
		connected: {
			2: '6-B',
			'-2': '4-B'
		}
	},
	"5-C" : {
		"id": '5-C',
		"checker": 0,
		connected: {
			'1': '6-B',
			'2': '6-D',
			'-1': '4-B',
			'-2': '4-D'
		}
	},
	"5-E" : {
		"id": '5-E',
		"checker": 0,
		connected: {
			'2': '6-F',
			'1': '6-D',
			'-2': '4-F',
			'-1': '4-D'
		}
	},
	"5-G" : {
		"id": '5-G',
		"checker": 0,
		connected: {
			'1': '6-F',
			'2': '6-H',
			'-1': '4-F',
			'-2': '4-H'
		}
	},
	"6-B" : {
		"id": '6-B',
		"checker": -1,
		connected: {
			'1': '7-A',
			'2': '7-C',
			'-1': '5-A',
			'-2': '5-C'
		}
	},
	"6-D" : {
		"id": '6-D',
		"checker": 0,
		connected: {
			'1': '7-C',
			'2': '7-E',
			'-1': '5-C',
			'-2': '5-E'
		}
	},
	"6-F" : {
		"id": '6-F',
		"checker": 0,
		connected: {
			'1': '7-E',
			'2': '7-G',
			'-1': '5-E',
			'-2': '5-G'
		}
	},
	"6-H" : {
		"id": '6-H',
		"checker": 0,
		connected: {
			'1': '7-G',
			'-1': '5-G'
		}
	},
	"7-A" : {
		"id": '7-A',
		"checker": 0,
		connected: {
			'2': '8-B',
			'-2': '6-B'
		}
	},
	"7-C" : {
		"id": '7-C',
		"checker": 0,
		connected: {
			'1': '8-B',
			'2': '8-D',
			'-1': '6-B',
			'-2': '6-D'
		}
	},
	"7-E" : {
		"id": '7-E',
		"checker": -1,
		connected: {
			'2': '8-F',
			'1': '8-D',
			'-2': '6-F',
			'-1': '6-D'
		}
	},
	"7-G" : {
		"id": '7-G',
		"checker": -1,
		connected: {
			'1': '8-F',
			'2': '8-H',
			'-1': '6-F',
			'-2': '6-H'
		}
	},
	"8-B" : {
		"id": '8-B',
		"checker": -2,
		connected: {
			'-1': '7-A',
			'-2': '7-C'
		}
	},
	"8-D" : {
		"id": '8-D',
		"checker": 0,
		connected: {
			'-2': '7-E',
			'-1': '7-C'
		}
	},
	"8-F" : {
		"id": '8-F',
		"checker": 0,
		connected: {
			'-1': '7-E',
			'-2': '7-G'
		}
	},
	"8-H" : {
		"id": '8-H',
		"checker": -2,
		connected: {
			'-1': '7-G'
		}
	}
}

/*export default {
	"1-A":{
		"id":'1-A',
		"checker": 0,
		connected: {
			'2': '2-B'
		}
	},
	"1-C":{
		"id":'1-C',
		"checker": 0,
		connected: {
			'1': '2-B',
			'2': '2-D'
		}
	},
	"1-E":{
		"id":'1-E',
		"checker": 0,
		connected: {
			'1': '2-D',
			'2': '2-F'
		}
	},
	"1-G":{
		"id":'1-G',
		"checker": 0,
		connected: {
			2: '2-H',
			1: '2-F'
		}
	},
	"2-B":{
		"id":'2-B',
		"checker": 0,
		connected: {
			1: '3-A',
			2: '3-C',
			'-1': '1-A',
			'-2': '1-C'
		}
	},
	"2-D":{
		"id":'2-D',
		"checker": 0,
		connected: {
			2: '3-E',
			1: '3-C',
			'-2': '1-E',
			'-1': '1-C'
		}
	},
	"2-F":{
		"id":'2-F',
		"checker": 0,
		connected: {
			1: '3-E',
			2: '3-G',
			'-1': '1-E',
			'-2': '1-G'
		}
	},
	"2-H":{
		"id":'2-H',
		"checker": 0,
		connected: {
			1: '3-G',
			'-1': '1-G'
		}
	},
	"3-A":{
		"id":'3-A',
		"checker": 0,
		connected: {
			'-2': '2-B',
			'2': '4-B'
		}
	},
	"3-C":{
		"id":'3-C',
		"checker": 0,
		connected: {
			'-1': '2-B',
			1: '4-B',
			2: '4-D',
			'-2': '2-D'
		}
	},
	"3-E":{
		"id":'3-E',
		"checker": 0,
		connected: {
			'-2': '2-F',
			2: '4-F',
			1: '4-D',
			'-1': '2-D'
		}
	},
	"3-G":{
		"id":'3-G',
		"checker": 0,
		connected: {
			'-1': '2-F',
			1: '4-F',
			2: '4-H',
			'-2': '2-H'
		}
	},
	"4-B":{
		"id":'4-B',
		"checker": 0,
		connected: {
			1: '5-A',
			2: '5-C',
			'-1': '3-A',
			'-2': '3-C'
		}
	},
	"4-D":{
		"id":'4-D',
		"checker": 0,
		connected: {
			2: '5-E',
			1: '5-C',
			'-2': '3-E',
			'-1': '3-C'
		}
	},
	"4-F":{
		"id":'4-F',
		"checker": 0,
		connected: {
			1: '5-E',
			2: '5-G',
			'-1': '3-E',
			'-2': '3-G'
		}
	},
	"4-H":{
		"id":'4-H',
		"checker": 0,
		connected: {
			1: '5-G',
			'-1': '3-G'
		}
	},
	"5-A":{
		"id":'5-A',
		"checker": 0,
		connected: {
			2: '6-B',
			'-2': '4-B'
		}
	},
	"5-C":{
		"id":'5-C',
		"checker": 0,
		connected: {
			'1': '6-B',
			'2': '6-D',
			'-1': '4-B',
			'-2': '4-D'
		}
	},
	"5-E":{
		"id":'5-E',
		"checker": 0,
		connected: {
			'2': '6-F',
			'1': '6-D',
			'-2': '4-F',
			'-1': '4-D'
		}
	},
	"5-G":{
		"id":'5-G',
		"checker": 0,
		connected: {
			'1': '6-F',
			'2': '6-H',
			'-1': '4-F',
			'-2': '4-H'
		}
	},
	"6-B":{
		"id":'6-B',
		"checker": 0,
		connected: {
			'1': '7-A',
			'2': '7-C',
			'-1': '5-A',
			'-2': '5-C'
		}
	},
	"6-D":{
		"id":'6-D',
		"checker": 0,
		connected: {
			'1': '7-C',
			'2': '7-E',
			'-1': '5-C',
			'-2': '5-E'
		}
	},
	"6-F":{
		"id":'6-F',
		"checker": 0,
		connected: {
			'1': '7-E',
			'2': '7-G',
			'-1': '5-E',
			'-2': '5-G'
		}
	},
	"6-H":{
		"id":'6-H',
		"checker": 0,
		connected: {
			'1': '7-G',
			'-1': '5-G'
		}
	},
	"7-A":{
		"id":'7-A',
		"checker": 0,
		connected: {
			'2': '8-B',
			'-2': '6-B'
		}
	},
	"7-C":{
		"id":'7-C',
		"checker": 0,
		connected: {
			'1': '8-B',
			'2': '8-D',
			'-1': '6-B',
			'-2': '6-D'
		}
	},
	"7-E":{
		"id":'7-E',
		"checker": 0,
		connected: {
			'2': '8-F',
			'1': '8-D',
			'-2': '6-F',
			'-1': '6-D'
		}
	},
	"7-G":{
		"id":'7-G',
		"checker": 0,
		connected: {
			'1': '8-F',
			'2': '8-H',
			'-1': '6-F',
			'-2': '6-H'
		}
	},
	"8-B":{
		"id":'8-B',
		"checker": 0,
		connected: {
			'-1': '7-A',
			'-2': '7-C'
		}
	},
	"8-D":{
		"id":'8-D',
		"checker": 0,
		connected: {
			'-2': '7-E',
			'-1': '7-C'
		}
	},
	"8-F":{
		"id":'8-F',
		"checker": 0,
		connected: {
			'-1': '7-E',
			'-2': '7-G'
		}
	},
	"8-H":{
		"id":'8-H',
		"checker": 0,
		connected: {
			'-1': '7-G'
		}
	}
}*/
