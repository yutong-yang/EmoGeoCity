import numpy as np
import jieba
import paddlehub as hub
import pandas as pd

# 加载模型
senta = hub.Module(name="senta_lstm")

# 加载数据集
datasets = np.load('../datasets/datasets.npy', encoding='bytes', allow_pickle=True)
poems = datasets.item()['金陵历朝诗歌']

poems_content_list = list(poems.content)
poems_content_jiebalist = []
poems_content_keywords_frequency_dict = {}
poems_content_keywords_list = []

# jieba分词诗歌
for poem_content in poems_content_list:
    poem_content_jieba = list(jieba.cut(poem_content, cut_all=True))
    poems_content_jiebalist.append(list(filter(lambda x: len(x) > 1, poem_content_jieba)))

for poem_content_jieba in poems_content_jiebalist:
    for poem_keyword_jieba in poem_content_jieba:
        if poem_keyword_jieba not in poems_content_keywords_frequency_dict:
            poems_content_keywords_frequency_dict[poem_keyword_jieba] = 0
        poems_content_keywords_frequency_dict[poem_keyword_jieba] += 1

# 诗歌关键词统计
poems_keywords_list = list(poems_content_keywords_frequency_dict.keys())
poems_keywords_list.sort(key=lambda x: poems_content_keywords_frequency_dict[x])
for poems_keyword in poems_keywords_list:
    print(poems_keyword, poems_content_keywords_frequency_dict[poems_keyword])


# 情感数据分析
# positive_scores = []
# results = senta.sentiment_classify(data={"text": poems_content_list})
# for index in range(len(results)):
#     positive_scores.append([index+1, results[index]['positive_probs']])
# positive_scores = pd.DataFrame(positive_scores)
# positive_scores.columns = ['id', 'scores']

# 情感数据存储
# poems2posiscores = {}
# poems2posiscores['scores'] = positive_scores
# np.save('../datasets/poems_scores', poems2posiscores)

# 诗歌2地点
# works2location = np.load('../datasets/works2location_freq.npy', encoding='bytes', allow_pickle=True)
# works2location = works2location.item()['works2location_freq']
# locations = list(works2location['地名'])
# locations = list(map(lambda x:x[0:2], locations))
# poems2location = []
# for i in range(len(poems)):
#     poem = poems.iloc[i]
#     id = poem['id']
#     title = poem['title']
#     content = poem['content']
#     for location in locations:
#         if location in title or location in content:
#             poems2location.append([id, title, location])
# poems2location = pd.DataFrame(poems2location)
# poems2location.columns = ['作品id', '作品名', '地名']
# poems2location_dict = {}
# poems2location_dict['poems2location'] = poems2location

# 诗歌2地点 保存
# np.save('../datasets/poems2location', poems2location_dict)

# 诗歌2地点 读取
poems2location = np.load('../datasets/poems/poems2location.npy', encoding='bytes', allow_pickle=True)
poems2location = poems2location.item()['poems2location']
'''
     金陵
     秦淮/秦淮河
     钟山
     石头/石头城
     雨花台
     凤凰/凤凰台
     燕子/燕子矶
     新亭
     台城
     青溪
     牛首/牛首山
     
     
     莫愁湖
     栖霞寺/栖霞/栖霞山
     
'''
print(poems);