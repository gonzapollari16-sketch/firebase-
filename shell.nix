{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    pkgs.nodejs
    pkgs.git
    pkgs.zip
  ];
}
