'use strict';

const itemInfo = require("./datbase.js").loadAllItems();
const onsaleInfo = require("./datbase.js").loadPromotions();

function printInventory(arr) {
    let list = arrToObj(arr);
    let infoArray = toAllInfo(list);
    let str = printInfo(infoArray);
    console.log(str);
}

function arrToObj(arr) {
    let list = {};
    for(let str of arr){
        if(str.length === 10){
            if(list[str]===undefined){
                list[str] = 1;
            }else{
                list[str]++;
            }
        }
        else{
            if(list[str.substring(0,10)]===undefined){
                list[str.substring(0,10)] = str.substring(11);
            }else{
                list[str.substring(0,10)] += parseInt(str.substring(11));
            }
        }
    }
    return list;

}

function toAllInfo(list){
    let infoArray = [
        {
            w:[],
            total:0,
            save:0
        }
    ];

    for(let good in list){
        let goodInfo = {};
        let index = itemInfo.map(i=>i.barcode).indexOf(good);
        let isOnsale = onsaleInfo[0].barcodes.indexOf(good);
        goodInfo.name = itemInfo[index].name;
        goodInfo.cnt = list[good];
        goodInfo.price = itemInfo[index].price;
        goodInfo.unit = itemInfo[index].unit;
        if(isOnsale === -1){
            goodInfo.sum = goodInfo.price*goodInfo.cnt;
        }
        else{
            let freeNum = parseInt(goodInfo.cnt/3);
            goodInfo.sum = goodInfo.price*(goodInfo.cnt-freeNum);

            //将送的商品的信息记录在数组的第一个元素中
            let x = {
                name: goodInfo.name,
                number: freeNum,
                unit: goodInfo.unit
            };
            infoArray[0].w.push(x);

            infoArray[0].save += goodInfo.price*freeNum;
        }
        infoArray[0].total += goodInfo.sum;
        infoArray.push(goodInfo);
    }
    return infoArray;
}

function printInfo(infoArray) {
    let str = "***<没钱赚商店>购物清单***\n";
    for(let i=1;i<infoArray.length;i++){
        str += `名称：${infoArray[i].name}，数量：${infoArray[i].cnt}${infoArray[i].unit}，单价：${infoArray[i].price.toFixed(2)}(元)，小计：${infoArray[i].sum.toFixed(2)}(元)\n`;
    }
    str += `----------------------
挥泪赠送商品：\n`;
    for(let i of infoArray[0].w){
        str += `名称：${i.name}，数量：${i.number}${i.unit}\n`;
    }
    str += `----------------------
总计：${infoArray[0].total.toFixed(2)}(元)
节省：${infoArray[0].save.toFixed(2)}(元)
**********************`;
    return str;
}

printInventory([
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
]);

module.exports = printInventory;