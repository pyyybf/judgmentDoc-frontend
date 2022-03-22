import HttpRequest from '@/axios/api.request'

const api = {
  editorPre: '/api/editor',
}

export const exportPdfAPI = (data) => {
  let body = new URLSearchParams();
  for (var key in data) {
    body.append(key, data[key]);
  }
  return HttpRequest.request({
    url: `${api.editorPre}/exportPdf`,
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export const checkAPI = (data) => {
  // return HttpRequest.request({
  //   url: `${api.editorPre}/check`,
  //   method: 'POST',
  //   params: {
  //     text: data
  //   }
  // })
  return new Promise((resolve, reject) => {
    try {
      resolve(tmpCheckResponse);
    } catch (e) {
      reject({
        data: {
          success: false,
          message: '检验失败',
          content: null,
        }
      })
    }
  });
}

const tmpCheckResponse = {
  data: {
    success: true,
    message: '',
    content: {
      accuracy: 78,
      factLess: 1,
      lawLess: 0,
      lawError: 0,
      textList: [
        {
          id: 'text-1',
          content: '公诉机关XX市XX区人民检察院。\n' +
            '被告人XX，于XX市XX区。\n' +
            'XX市XX区人民检察院X检X诉XX号起诉书指控被告人XX犯交通肇事罪于XX年X月X日向本院提起公诉。本院审查后于当日受理，依法组成合议庭，公开开庭审理本案。XX市XX区人民检察院指派代理检察员XX出庭支持公诉，被告人XX到庭参加诉讼。现已审理终结。\n' +
            'XX市XX区人民检察院指控，XX年X月X日晚，被告人XX驾驶XXX号小型客车，',
          type: 0, //普通文本
        },
        {
          id: 'fact-1',
          content: '在本市XX行驶中撞上XXX，致其死亡。',
          type: 1, //事实
          count: 1,
          relations: ['law-1']
        },
        {
          id: 'text-2',
          content: '经公安机关认定，XX负事故的全部责任。\n' +
            '经审理查明，XX年X月X日X时许，被告人XX驾驶牌照号为XXX的小型客车，在本市XX公路行驶至XX，撞上XXX，致其颅脑损伤合并创伤性休克死亡。次日，XX被抓获。经公安机关认定，XX负事故的全部责任。\n' +
            '另查明，案发后，被告人XX赔偿被害人亲属各项经济损失X万元，并得到谅解。\n' +
            '上述事实，有证人XXX证言，被告人XX供述及案件来源、到案经过、道路交通事故现场勘查笔录、交通司法鉴定意见书赔偿调解书、谅解书等证据予以证实。\n' +
            '本院认为，被告人XX违反道路交通安全法的规定，发生致一人死亡的重大交通事故，且负事故的全部责任，其行为构成交通肇事罪。鉴于其在归案后能如实供述犯罪事实，当庭认罪，结合其赔偿被害人经济损失，并获得谅解的情节，可对其依法从轻处罚。依据',
          type: 0, //普通文本
        },
        {
          id: 'law-1',
          content: '《中华人民共和国刑法》第一百三十三条',
          type: 2, //法条
          article: {
            id: 141,
            content: '第一百三十三条　【交通肇事罪】违反交通运输管理法规，因而发生重大事故，致人重伤、死亡或者使公私财产遭受重大损失的，处三年以下有期徒刑或者拘役；交通运输肇事后逃逸或者有其他特别恶劣情节的，处三年以上七年以下有期徒刑；因逃逸致人死亡的，处七年以上有期徒刑。',
            number: '第一百三十三条',
            crime: '交通肇事罪',
            catalogId: 30,
            law: '中华人民共和国刑法',
          },
          relations: ['fact-1'],
        },
        {
          id: 'text-3',
          content: '、',
          type: 0, //普通文本
        },
        {
          id: 'law-2',
          content: '第六十七条',
          type: 2, //法条
          article: {
            id: 69,
            content: '第六十七条　【自首】犯罪以后自动投案，如实供述自己的罪行的，是自首。对于自首的犯罪分子，可以从轻或者减轻处罚。其中，犯罪较轻的，可以免除处罚。\n' +
              '被采取强制措施的犯罪嫌疑人、被告人和正在服刑的罪犯，如实供述司法机关还未掌握的本人其他罪行的，以自首论。\n' +
              '犯罪嫌疑人虽不具有前两款规定的自首情节，但是如实供述自己罪行的，可以从轻处罚；因其如实供述自己罪行，避免特别严重后果发生的，可以减轻处罚。',
            number: '第六十七条',
            crime: '自首',
            catalogId: 21,
            law: '中华人民共和国刑法',
          },
          relations: [],
        },
        {
          id: 'text-4',
          content: '第三款之规定，判决如下：\n',
          type: 0, //普通文本
        },
        {
          id: 'conclusion-1',
          content: '被告人XX犯交通肇事罪，判处有期徒刑三年。（刑期从判决执行之日起计算。判决执行以前先行羁押的，羁押一日折抵刑期一日。即从XX年X月X日起，至XX年X月X日止）。\n',
          type: 3, //结论
          count: 1,
          relations: ['law-1'],
        },
        {
          id: 'text-5',
          content: '如不服本判决，可在接到判决书的第二日起十日内，通过本院或者直接向天津市第一中级人民法院提出上诉。书面上诉的，应提交上诉状正本一份，副本二份。\n',
          type: 0, //普通文本
        },
      ]
    }
  }
}
