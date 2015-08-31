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

wholeFile :: Parsec String st [[[String]]]
wholeFile =
  do
    preamble
    string "\\section*"
    count 1 section
    -- many section
    -- pages <- many section
    -- sectionNames <- sepBy section (lookAhead $ try $ (string "\\section*" <?> "section header"))
    -- eof
    -- return pages

preamble :: Parsec String st String
preamble = manyTill anyChar (lookAhead $ try $ string "\\section*")

section :: Parsec String st [[String]]
section = do
  string "\\section*"
  name <- between (char '{') (char '}') (many $ noneOf "{}")
  -- pages <- manyTill page (try (string "\\section*" <|>
                         -- (eof *> return "") <?>
                         -- "next section start or end of document"))
  -- pages <- many page
  -- return pages
  -- manyTill page (lookAhead $
                 -- try (string "\\section*" <?> "beginning of next section"))
  many page

page :: Parsec String st [String]
page = do
  spaces
  -- items <- count 2 (item <|> count 1 anyChar)
  items <- many item
  manyTill anyChar ((lookAhead . try) (string "\\newpage" <?> "new page") <|>
                    (lookAhead . try) (string "\\section*" <?> "new section") <|>
                    ((eof *> return "") <?> "eof"))
  return items

item :: Parsec String st String
item =
  spaces *>
  try (string "\\item ") *> manyTill (try anyChar)
  (try (string "\\section*") <|>
   try (string "\\item") <|>
   try (string "\\newpage") <|>
   eof *> pure "")

sections :: String
sections = "\\section*{section1}\n\n\\item stuff\n\n\\section*{section2}\n\n\\item stuff2"

itemsT = "\\item item 1\n\n\\item item \\emph{2}"
