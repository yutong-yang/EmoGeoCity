import numpy as np
import jieba
import paddlehub as hub
import pandas as pd

# 加载模型
senta = hub.Module(name="senta_lstm")

# 加载数据集
datasets = np.load('../datasets/datasets.npy', encoding='bytes', allow_pickle=True)
poems = datasets.item()['金陵历朝诗歌']
works = datasets.item()['作品表']

poems_content = poems['content']
poems_content = poems_content[poems_content.isnull() == False]
works_content = works['诗歌全文']
works_content = works_content[works_content.isnull() == False]

# poems_content = list(poems_content)
works_content = list(works_content)

jieba_list = []


# jieba分词为关键词
def cut2keywords(content_list):
    for content in content_list:
        keywords_list = list(jieba.cut(content, cut_all=True))
        jieba_list.append(list(filter(lambda x: len(x) > 1, keywords_list)))


# cut2keywords(poems_content)
# cut2keywords(works_content)


# 统计关键词
def calc_keywords(keywords_list):
    keywords_dict = {}
    for keywords in keywords_list:
        for keyword in keywords:
            if keyword not in keywords_dict:
                keywords_dict[keyword] = 0
            keywords_dict[keyword] += 1
    return keywords_dict


keywords_dict = calc_keywords(jieba_list)
keywords_list = list(keywords_dict)
keywords_list.sort(key=lambda x: -keywords_dict[x])
keywords_df = pd.DataFrame(map(lambda x: [x, keywords_dict[x]], keywords_list))
keywords_df.columns = ['关键词', '词频']
# np.save('../datasets/poems/keywords', {'keywords': keywords_df})


# # poems对应关键词 保存
# poems2keywords = []
# for i in range(len(poems)):
#     line = poems.iloc[i]
#     id = line['id']
#     poems2keywords.append([id, jieba_list[i]])
# poems2keywords = pd.DataFrame(poems2keywords)
# poems2keywords.columns = ['诗歌作品id', '关键词']
# np.save('../datasets/poems/poems2keywords', {'poems2keywords': poems2keywords})

# works对应关键词 保存
# works2keywords = []
# works = works[works['诗歌全文'].isnull() == False]
# for i in range(len(works)):
#     line = works.iloc[i]
#     id = line['作品id']
#     works2keywords.append([id, jieba_list[i]])
# works2keywords = pd.DataFrame(works2keywords)
# works2keywords.columns = ['作品id', '关键词']
# np.save('../datasets/poems/works2keywords', {'works2keywords': works2keywords})


# 情感数据分析
positive_scores = []
results = senta.sentiment_classify(data={"text": works_content})
works = works[works['诗歌全文'].isnull() == False]
for index in range(len(works)):
    positive_scores.append([works.iloc[index]['作品id'], results[index]['positive_probs']])
positive_scores = pd.DataFrame(positive_scores)
positive_scores.columns = ['id', 'scores']


# 情感数据存储
works2posiscores = {}
works2posiscores['scores'] = positive_scores
np.save('../datasets/poems/works_scores', works2posiscores)


print('content_process')


