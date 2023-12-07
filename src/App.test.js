import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App.js';
import Model from './model/Model.js'
import { Coord } from './model/Model.js'
import { Helper } from './model/Model.js'

import {config_5x5} from './model/Puzzle.js'
var puzzle = JSON.parse(JSON.stringify(config_5x5));

var model = new Model(puzzle);
test('No moves when model created', () => {
  expect(model.moveCounter).toBe(0);
});
test('Coord initialize', () => {
  let coord = new Coord(1,1);
  expect(coord.row).toBe(1);
  expect(coord.col).toBe(1);
});
test('letterToNumber', () => {
  expect(Helper.letterToNumber("A")).toBe(1);
  expect(Helper.letterToNumber("C")).toBe(3);
});
test('Coord initialize with string', () => {
  let coord = new Coord(1,"A");
  expect(coord.row).toBe(1);
  expect(coord.col).toBe(1);
});
test('puzzle gets size 5', () => {
  expect(model.puzzle.size).toBe(5);
});
test('Board has 12 elements', () => {
  expect(model.puzzle.board.pieces.size).toBe(12);
});
test('Board has red piece at 1, 4', () => {
  expect(model.puzzle.board.pieces.get("14").color).toBe("red");
});
test('Board has red piece at 3, 5', () => {
  expect(model.puzzle.board.pieces.get("35").color).toBe("red");
});
test('getCoordTo works', () => {
  let coord = new Coord(1,"A"); //(1,1)
  let expectedCoord = new Coord(1,3);
  coord = coord.getCoordTo(0,-1,3);
  expect(coord.row).toBe(expectedCoord.row);
  expect(coord.col).toBe(expectedCoord.col);
  // coord is 1,3
  expectedCoord = new Coord(3,3);
  coord = coord.getCoordTo(-1,0,3);  
  expect(coord.row).toBe(expectedCoord.row);
  expect(coord.col).toBe(expectedCoord.col);
  // coord is 3,3
  expectedCoord = new Coord(3,1);
  coord = coord.getCoordTo(0,1,3);
  expect(coord.row).toBe(expectedCoord.row);
  expect(coord.col).toBe(expectedCoord.col);
  // coord is 3,1
  expectedCoord = new Coord(1,1);
  coord = coord.getCoordTo(1,0,3);
  expect(coord.row).toBe(expectedCoord.row);
  expect(coord.col).toBe(expectedCoord.col);
});
test('Properly renders 0 moves', () => {
  const { getByText } = render(<App />);
  const movesElement = getByText(/Moves: /);
  expect(movesElement).toBeInTheDocument();
});