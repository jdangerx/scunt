{-# LANGUAGE OverloadedStrings #-}

import Data.Monoid
import Data.Text.Lazy

import Web.Scotty

main :: IO ()
main = scotty 3000 $ do
       get "/list" $ do
         accept <- header "Accept"
         case accept of
          Nothing -> html "list"
          Just something ->
            if "text/html" `elem` splitOn "," something
            then html "we want html"
            else html "we do not want html"
       get "/list/:num" $ do
         num <- param "num"
         html $ "Item " <> num
