module ListParser where

import Text.Parsec
import Data.Time.LocalTime
import Data.Time.Calendar (fromGregorian)
-- import Text.Parsec ((<?>))

-- import Control.Applicative

-- import Control.Monad.Identity (Identity)

chiTZ :: TimeZone
chiTZ = TimeZone (-360) False "CST"

data Section = Section String [Page]
               deriving (Show)

data Page = Page Int [Item]
               deriving (Show)

data Item = Item {
  text :: String,
  -- lb :: PointValue,
  -- ub :: PointValue,
  points :: String,
  early :: Bool,
  -- deadline :: Maybe ZonedTime,
  status :: Status,
  location :: Maybe String
  }
               deriving (Show)

type PointValue = Double

data Status = NotStarted
                      | Started
                      | Done
               deriving (Show)

theList :: Parsec String st [Section]
theList = manyTill anyChar (string "\\section*") *> many section

section :: Parsec String st Section
section = do
  name <- between (char '{') (char '}') (many anyChar)
  pages <- manyTill page (string "\\section*" <|> string "\\end{document}")
  return $ Section name pages

page :: Parsec String st Page
page = manyTill item (string "\\newpage") >>= \items -> return $ Page 1 items

item :: Parsec String st Item
item = do
  string "\\item"
  text <- manyTill anyChar (lookAhead $ char '[')
  points <- between (char '[') (char ']') (many $ noneOf "]")
  spaces
  early <- option False (string "\\clock" *> return True)
  return Item  {text = text,
                points = points,
                early = early,
                status = NotStarted,
                location = Nothing}
