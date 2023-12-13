# Peg client
must use node 16

## dev and build
* `electron:dev`
* `electron:build`

## build everything 
* `git checkout release`
* `git merge master`
* change package.json version
* `git add .`
* `git commit -am v1.0.0`
* `git tag v1.0.0`
* `git push && git push --tags`
* go to https://github.com/daysgobye/peg2/releases make a new release that is using the new tag and name it the same as the tag