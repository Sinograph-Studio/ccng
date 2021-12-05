'use strict';


var 標記 = {
  不轉換: '{}',
  預設: '[]'
}


var 簡化表 = {
  /**
   *  【格式】
   *    ・繁體字 -> 簡化字（規範字）
   */
}


var 地區表 = {
  /**
   *  【格式】
   *    ・索引: 港台用語 -> [{         ［網路］
   *      ・用語: 中國大陸用語         ［网络］
   *      ・地區: 「中」(中國大陸)     ［中］
   *      ・原文: 英文/日文原詞        ［network］
   *      ・類別: 「地區用詞表」之索引 ［電腦］
   *    }]
   */
}


function 生成地區表 () {
  // 該函式只會被調用一次
  const 中國大陸 = '中'
  const 香港 = '港'
  const 台灣 = '台'
  const 原文 = '原'
  地區表 = {}
  function 生成用語列表 (字串或列表) {
    if ( typeof 字串或列表 == 'string' ) {
      return [字串或列表]
    } else {
      return 字串或列表
    }
  }
  for ( let 類別 of Object.keys(地區用詞表) ) {
    for ( let 用語 of 地區用詞表[類別] ) {
      let 香港用語表 = 生成用語列表(用語[香港])
      let 台灣用語表 = 生成用語列表(用語[台灣])
      let 港台用語表 = getlist(concat(香港用語表, 台灣用語表))
      for ( let 港台用語 of 港台用語表 ) {
        if ( 地區表.不存在(港台用語) ) {
          地區表[港台用語] = []
        }
        let 對應用語表 = 生成用語列表(用語[中國大陸])
        for ( let 對應用語 of 對應用語表 ) {
          地區表[港台用語].添加({
            '用語': 對應用語,
            '地區': 中國大陸,
            '原文': 用語[原文],
            '類別': 類別
          }) // 添加之
        } // 遍歷對應用語
      } // 遍歷港台用語
    } // 遍歷用語條目
  } // 遍歷分表
}


function 生成簡化表 () {
  // 該函式只會被調用一次
  簡化表 = {}
  map(繁化表, function (簡化字, 繁體字) {
    確認( 簡化表.不存在(繁體字) ) // 繁化表必須是一一映射
    簡化表[繁體字] = 簡化字
  })
  map(一簡多繁表, function (簡化字, 對應表) {
    map(對應表.對應字, function (繁體字, 例詞表) {
      if ( 繁體字 != 簡化字 && 一繁多簡表.不存在(繁體字) ) {
        確認( 簡化表.不存在(繁體字) )
        簡化表[繁體字] = 簡化字
      }
    })
  })
  map(正異取捨表, (條目, 字組表) => map(
    字組表, 字組 => (function (規範字, 對應表) {
      map(對應表, function (繁體字) {
        // 對應表[0] == 字組[0] == 規範字 不是繁體字，但下面有判斷所以無所謂
        if ( 繁體字 != 規範字 && 一繁多簡表.不存在(繁體字) ) {
          簡化表[繁體字] = 規範字
        }
      })
    })(字組[0], 字組) 
  ))
}


// 以下語句需要保證在轉換之前能够執行
生成地區表()
生成簡化表()
var 簡化規則 = new 轉換規則(簡化表, 一繁多簡表, {}, 地區表)


function 簡化(字串) {
  var 文 = new 文章(文章.生成字表(字串, 簡化規則, 標記), 簡化規則)
  return 文
}



