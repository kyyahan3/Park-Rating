#!/bin/bash

mongoimport --db npdatabase --collection comments --file comments.json --jsonArray
mongoimport --db npdatabase --collection newsreleases --file newsreleases.json --jsonArray
mongoimport --db npdatabase --collection thingstodo --file thingstodo.json --jsonArray
mongoimport --db npdatabase --collection visitcenter --file visitcenter.json --jsonArray
mongoimport --db npdatabase --collection ca_np --file ca_np.json --jsonArray