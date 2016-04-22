##
# get the dist files alone
#

# clone repository into temp folder
git clone git@github.com:Saber-Team/BusinessObjects.git .temp

# dist folder
mkdir -p third_party

# move
mv .temp/dist/* third_party

# remove temp folder
rm -rf .temp
