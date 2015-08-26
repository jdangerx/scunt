module ListParser where

import Control.Monad

import Text.Parsec

-- import Control.Applicative

-- import Control.Monad.Identity (Identity)

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

listLoc :: String
listLoc = "/home/john/phoenixparsing/tex4scavvies_2015.tex"

wholeFile :: Parsec String st [[String]]
wholeFile =
  do
    preamble
    string "\\section*"
    count 3 section
    pages <- many section
    -- sectionNames <- sepBy section (lookAhead $ try $ (string "\\section*" <?> "section header"))
    -- eof
    return pages

preamble :: Parsec String st String
preamble = manyTill anyChar (lookAhead $ try $ string "\\section*")

section :: Parsec String st [String]
section = do
  name <- between (char '{') (char '}') (many $ noneOf "{}")
  pages <- manyTill page (try (string "\\section*" <|>
                         (eof *> return "") <?>
                         "next section start or end of document"))
  return $ name : pages

page :: Parsec String st String
page = do
  -- head <- count 50 anyChar <?> "getting head"
  firstItem <- (try (spaces *> string "\\item " *> count 20 anyChar)) <|> count 1 anyChar
  -- manyTill anyChar (try ((string "\\newpage") <?> "new page") <|>
                    -- ((eof *> return "") <?> "eof"))
  manyTill anyChar (try ((string "\\newpage") <?> "new page") <|>
                    ((eof *> return "") <?> "eof"))
  return firstItem
