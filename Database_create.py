import string
import random
from app import create_app
from app import dataBase
from app.models import User

appFlask = create_app()
appFlask.app_context().push()

# Check current database state
old_usrs = User.query.all()
print(old_usrs)

# Remove existing users from dataBase
for usr in old_usrs:
    dataBase.session.delete(usr)

dataBase.session.commit()

# Create file that will contain new user data
usr_list = open("User_list.txt", "w")

# Create new Users
txt_pass_count = 12
new_user_count = 255

for i in range(0, new_user_count):
    usr_name = 'ucmc2020ss' + format(i, '03d')
    txt_pass = ''.join(random.choices(string.ascii_letters + string.digits, k=txt_pass_count))
    usr_list.write(usr_name + " : " + txt_pass + "\n")

    # It works correctly but further investigation on what's going on required.
    new_user = User(username=usr_name, local_folder=usr_name)
    new_user.set_password(txt_pass)
    dataBase.session.add(new_user)

dataBase.session.commit()
new_usrs = User.query.all()
print(new_usrs)








