import string
import random
import os
from distutils.dir_util import copy_tree

# Create new User folders
new_user_count = 255

for i in range(0, new_user_count):
	usr_name = 'ucmc2020ss' + format(i, '03d')
	usr_folder = 'userdata/' + usr_name
	if not os.path.exists('userdata/' + usr_name):
		os.makedirs('userdata/' + usr_name)
	copy_tree('userdata/ucmc2020ssRoot', 'userdata/' + usr_name)








