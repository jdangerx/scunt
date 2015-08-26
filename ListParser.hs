module ListParser where

import Control.Monad

import Text.Parsec
import Data.Time.LocalTime
import Data.Time.Calendar (fromGregorian)
-- import Text.Parsec ((<?>))

-- import Control.Applicative

-- import Control.Monad.Identity (Identity)

chiTZ :: TimeZone
chiTZ = TimeZone (-360) False "CST"

data Section = Section {
  name :: String,
  pages :: [Page]
  }
               deriving (Show)

data Page = Page {
  num :: Int,
  items :: [Item]
  }
          deriving (Show)

data Item = Item {
  text :: String,
  points :: String,
  early :: Bool
  }
               deriving (Show)

type PointValue = Double

data Status = NotStarted
                      | Started
                      | Done
               deriving (Show)

theList :: Parsec String st [Section]
theList =
  -- filter ((== "Items") . name) <$>
  (manyTill anyChar (try $ string "\\section*") *>
   sepBy section (try $ string "\\section*"))

section :: Parsec String st Section
section = do
  name <- between (char '{') (char '}') (many (noneOf "}"))
  pages <- sepBy page (try (string "\\newpage"))
  string "\\end{document}"
  spaces
  return $ Section name pages

page :: Parsec String st Page
page = do
  items' <- sepBy item (try (spaces *> string "\\item"))
  return $ Page 1 items'

item :: Parsec String st Item
item = do
  spaces
  t <- manyTill anyChar (lookAhead $ char '[')
  p <- between (char '[') (char ']') (many $ noneOf "]")
  spaces
  e <- option False (try $ string "\\clock" *> return True)
  option "" (between (char '$') (char '$') (many $ noneOf "$"))
  spaces
  return Item  {text = t,
                points = p,
                early = e
                }

itemTextEarly :: String
itemTextEarly = "\\item Dance, monkey, dance! [0 points] \\clock"

itemText :: String
itemText = "\\item Dance, monkey, dance! [0 points]"

testParseItem :: String -> Either ParseError Item
testParseItem = parse item ""

pageText :: String
pageText = join $ replicate 2 (itemText ++ "\n\n")

pagesText :: String
pagesText = join (replicate 2 (itemText ++ "\n\n") ++ ["\\newpage\n\n"] ++
                  replicate 2 (itemTextEarly ++ "\n\n") ++ ["\\end{list}"]
                 )

testParsePage :: String -> Either ParseError Page
testParsePage = parse page ""

sectionText :: String
sectionText = "{section name}\n\n" ++ pagesText ++ "\n\n\\section*{next section}"
