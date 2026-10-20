# GadgetCart

It's a cli app which read a `txt` files with predefined commands to

- Load products, tiers and promotions
- Cart, adding, removing products, applying promotions and printing (stdout) a quote

## Perquisites

- Node `>v24` as it runs typescript files without transpilation

## Running

1. Install dependencies (types only)

```bash
npm install
```

2. Run simple demo

```bash
node main.ts data/simple.txt
```

2. Run demo with discounts

```bash
node main.ts data/promo.txt
```
