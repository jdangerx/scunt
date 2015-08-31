{-# LANGUAGE EmptyDataDecls             #-}
{-# LANGUAGE FlexibleContexts           #-}
{-# LANGUAGE GADTs                      #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE MultiParamTypeClasses      #-}
{-# LANGUAGE OverloadedStrings          #-}
{-# LANGUAGE QuasiQuotes                #-}
{-# LANGUAGE TemplateHaskell            #-}
{-# LANGUAGE TypeFamilies               #-}
module Models where

import           Control.Monad.IO.Class  (liftIO)
import           Database.Persist
import           Database.Persist.Sqlite
import           Database.Persist.TH

import Data.Aeson
import Data.Maybe

share [mkPersist sqlSettings, mkMigrate "migrateAll"] [persistLowerCase|
Item
    text String
    points String
    lb Double
    ub Double
    num Int
    pagenum Int
    early Bool
    status String Maybe
    location String Maybe
|]

instance Show Item where
  show item = show (itemNum item) ++ " " ++ itemText item ++ " " ++
    itemPoints item ++ fromMaybe "Not started" (itemStatus item)

instance FromJSON Item where
  parseJSON = withObject "item" $ \o ->
    do
      text <- o .: "text"
      points <- o .: "point_txt"
      lb <- o .: "min_val"
      ub <- o .: "max_val"
      num <- o .: "number"
      page <- o .: "page"
      early <- o .: "earlysub"
      return $ Item text points lb ub num page early Nothing Nothing

instance ToJSON Item where
  toJSON i = object [
    "text" .= itemText i,
    "point_txt" .= itemPoints i,
    "min_val" .= itemLb i,
    "max_val" .= itemUb i,
    "number" .= itemNum i,
    "page" .= itemPagenum i,
    "earlysub" .= itemEarly i,
    "status" .= itemStatus i,
    "location" .= itemLocation i]
  
