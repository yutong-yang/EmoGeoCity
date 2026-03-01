import numpy as np

# 导入datasets
datasets = np.load('../datasets/datasets.npy', encoding='bytes', allow_pickle=True)
datasets = datasets.item()

# location
all_location_freq = np.load('../datasets/all_location_freq.npy', encoding='bytes', allow_pickle=True)
all_location_freq = all_location_freq.item()['all_location_freq']
events2location = np.load('../datasets/events2location.npy', encoding='bytes', allow_pickle=True)
events2location = events2location.item()['events2location']
events2location_freq = np.load('../datasets/events2location_freq.npy', encoding='bytes', allow_pickle=True)
events2location_freq = events2location_freq.item()['events2location_freq']
events_all_location_freq = np.load('../datasets/events_all_location_freq.npy', encoding='bytes', allow_pickle=True)
events_all_location_freq = events_all_location_freq.item()['events_all_location_freq']
events_only_location_freq = np.load('../datasets/events_only_location_freq.npy', encoding='bytes', allow_pickle=True)
events_only_location_freq = events_only_location_freq.item()['events_only_location_freq']
people2location = np.load('../datasets/people2location.npy', encoding='bytes', allow_pickle=True)
people2location = people2location.item()['people2location']
people2location_freq = np.load('../datasets/people2location_freq.npy', encoding='bytes', allow_pickle=True)
people2location_freq = people2location_freq.item()['people2location_freq']
people_all_location_freq = np.load('../datasets/people_all_location_freq.npy', encoding='bytes', allow_pickle=True)
people_only_location_freq = np.load('../datasets/people_only_location_freq.npy', encoding='bytes', allow_pickle=True)
people_only_location_freq = people_only_location_freq.item()['people_only_location_freq']
works2location = np.load('../datasets/works2location.npy', encoding='bytes', allow_pickle=True)
works2location = works2location.item()['work2location']
works2location_freq = np.load('../datasets/works2location_freq.npy', encoding='bytes', allow_pickle=True)
works2location_freq = works2location_freq.item()['works2location_freq']
works_all_location_freq = np.load('../datasets/works_all_location_freq.npy', encoding='bytes', allow_pickle=True)
works_all_location_freq = works_all_location_freq.item()['works_all_location_freq']
works_only_location_freq = np.load('../datasets/works_only_location_freq.npy', encoding='bytes', allow_pickle=True)
works_only_location_freq = works_only_location_freq.item()['works_only_location_freq']


# poems
poems2location = np.load('../datasets/poems/poems2location.npy', encoding='bytes', allow_pickle=True)
poems2location = poems2location.item()['poems2location']
poems_scores = np.load('../datasets/poems/poems_scores.npy', encoding='bytes', allow_pickle=True)
poems_scores = poems_scores.item()['scores']
poems2keywords = np.load('../datasets/poems/poems2keywords.npy', encoding='bytes', allow_pickle=True)
poems2keywords = poems2keywords.item()['poems2keywords']
works2keywords = np.load('../datasets/poems/works2keywords.npy', encoding='bytes', allow_pickle=True)
works2keywords = works2keywords.item()['works2keywords']
works_scores = np.load('../datasets/poems/works_scores.npy', encoding='bytes', allow_pickle=True)
works_scores = works_scores.item()['scores']

# keywords
keywords = np.load('../datasets/poems/keywords.npy', encoding='bytes', allow_pickle=True)
keywords = keywords.item()['keywords']


def datasets_read():
    return [datasets, events2location, people2location, works2location, poems2location
            , poems2keywords, works2keywords, keywords]

