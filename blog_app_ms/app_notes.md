# microservice blog app project 

## backend 

to create a microservice backend all you need to do is , setup independent service backend first. 

- We are using typescript . toh hume typescript globally install kr k tsconfig file initialise krna hoga ... using npx tsc -init

- tsc file mei target (make it es2020) , outdir, rootdir , module(set nodenext) set kr do 

- aur qki ts file ko js mei baar baar compile krna padega , uske liye fir concurrently package use kro . 

- cloudinary mei image bhejne ka best tareeka hai . image buffer bna k bhejo . jiske liye datauri package hota hai . 