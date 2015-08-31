{-# LANGUAGE OverloadedStrings          #-}

import Data.Aeson
import Data.Maybe (fromMaybe)
import Control.Monad.IO.Class  (liftIO)
import Database.Persist.Sqlite
import qualified Data.ByteString.Lazy as B

import Models

main :: IO()
main = do
  listJson <- B.readFile "list.json"
  let list = fromMaybe [] (decode listJson :: Maybe [Item])
  runSqlite "scunt.db" $ do
    runMigration migrateAll
    mapM_ insert list
    oneItem <- selectFirst [ItemNum ==. 231] []
    liftIO $ print (itemText . entityVal <$> oneItem)
    otherItem <- selectFirst [ItemNum ==. 180] []
    liftIO $ print (itemText . entityVal <$> otherItem)
