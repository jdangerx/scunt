{-# LANGUAGE OverloadedStrings #-}

import Data.Aeson

import Data.Maybe
import Data.Monoid
import Data.Text.Lazy
import Database.Persist.Sqlite (runSqlite, selectFirst, selectList, (==.), entityVal, update, (=.), entityKey)
import Database.Persist (SelectOpt(Asc))


import Web.Scotty

import Models

main :: IO ()
main = scotty 3000 $ do
       get "/list" $ do
         accept <- header "Accept"
         allItems <- runSqlite "scunt.db" $ selectList [] [Asc ItemNum]
         let txt = (show . entityVal) <$> allItems
         case accept of
          Nothing -> html "You don't want anything, and I'm not gonna give it to you."
          Just something ->
            if "text/html" `elem` splitOn "," something
            then text $ pack (Prelude.unlines . Prelude.map (++ "\n") $ txt)
            else Web.Scotty.json $ (toJSON . entityVal) <$> allItems
       get "/list/:num" $ do
         num <- param "num"
         item <- runSqlite "scunt.db" $ selectFirst [ItemNum ==. num] []
         let txt = (show . entityVal) <$> item
         html $ fromMaybe "no such item" (pack <$> txt)
       get "/claim/:num" $ do
         num <- param "num"
         item <- runSqlite "scunt.db" $ selectFirst [ItemNum ==. num] []
         let itemKey = entityKey <$> item
         if isJust itemKey
         then runSqlite "scunt.db" $ update (fromJust itemKey) [ItemStatus =. Just "claimed"]
         else text "No such item"
         text "Item claimed!"
         -- liftIO $ print <$> item
         -- let itemId = <$> item
         -- let txt = (show . entityVal) <$> item
         -- html $ fromMaybe "no such item" 
