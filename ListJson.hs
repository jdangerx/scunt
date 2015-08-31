{-# LANGUAGE OverloadedStrings #-}

import Data.Aeson
import qualified Data.ByteString.Lazy as B

data Item = Item {
  text :: String,
  points :: String,
  lb :: Double,
  ub :: Double,
  num :: Int,
  pagenum :: Int,
  early :: Bool
  } deriving Show

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
      return $ Item text points lb ub num page early

main :: IO ()
main = do
  list <- B.readFile "list.json"
  print $ filter (\i -> lb i > 50) <$> decode list
