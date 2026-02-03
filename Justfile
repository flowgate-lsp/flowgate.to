# Justfile for Flowgate LSP

# List all available commands
default:
    @just --list

# Bootstrap the development environment (install dependencies)
bootstrap:
    yarn install

# Start the development server with Hot Module Replacement (JIT auto loading)
dev:
    yarn dev

# Build the project for production
build:
    yarn build

# Preview the production build
preview:
    yarn preview
