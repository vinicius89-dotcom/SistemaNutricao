import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyData, validDate, validateData, totalForDay, recordWeight } from '../model.js';
test('soma apenas as refeições da data selecionada, inclusive após recuperar JSON', () => {
 const data = emptyData();
 data.meals = [{id:'1',date:'2026-11-02',name:'Almoço',type:'Almoço',calories:450},{id:'2',date:'2026-11-02',name:'Lanche',type:'Lanche',calories:150},{id:'3',date:'2026-11-01',name:'Jantar',type:'Jantar',calories:500}];
 const restored = JSON.parse(JSON.stringify(data));
 assert.equal(validateData(restored),true);
 assert.equal(totalForDay(restored,'2026-11-02'),600);
 assert.equal(totalForDay(restored,'2026-10-31'),0);
});
test('atualiza peso na mesma data e ordena o histórico sem alterar o original', () => {
 const original = emptyData();
 let data = recordWeight(original,'2026-11-02',72.5);
 data = recordWeight(data,'2026-11-01',73);
 data = recordWeight(data,'2026-11-02',72.1);
 assert.deepEqual(data.weights,[{date:'2026-11-02',value:72.1},{date:'2026-11-01',value:73}]);
 assert.deepEqual(original.weights,[]);
});
test('rejeita datas impossíveis, valores não finitos e dados corrompidos', () => {
 assert.equal(validDate('2026-02-30'),false);
 assert.equal(validDate('2024-02-29'),true);
 for (const value of [0,-1,Infinity,NaN,601]) assert.throws(() => recordWeight(emptyData(),'2026-11-02',value));
 assert.equal(validateData({...emptyData(),goal:0}),false);
 assert.equal(validateData({...emptyData(),meals:[null]}),false);
 assert.equal(validateData(null),false);
});
