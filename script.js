//* Instructions
// Design a cash register drawer function checkCashRegister() that
// accepts purchase price as the first argument (price), payment as
// the second argument (cash), and cash-in-drawer (cid) as the third argument.

// cid is a 2D array listing available currency.

// The checkCashRegister() function should always return an object
// with a status key and a change key.

// Return {status: "INSUFFICIENT_FUNDS", change: []} if cash-in-drawer
// is less than the change due, or if you cannot return the exact change.

// Return {status: "CLOSED", change: [...]} with cash-in-drawer as the
// value for the key change if it is equal to the change due.

// Otherwise, return {status: "OPEN", change: [...]}, with the change due in
// coins and bills, sorted in highest to lowest order, as the value of the change key.

function flattenArray(ary) {
  return ary.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b),
    []
  );
}
function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function checkCashRegister(price, cash, cid) {
  const denominations = {
    PENNY: 0.01,
    NICKEL: 0.05,
    DIME: 0.1,
    QUARTER: 0.25,
    ONE: 1,
    FIVE: 5,
    TEN: 10,
    TWENTY: 20,
    "ONE HUNDRED": 100,
  };
  const changeOwed = cash - price;
  let changeInDrawer = [...cid]; // copy of the array
  let changeInHand = {
    value: 0,
    change: [
      ["PENNY", 0],
      ["NICKEL", 0],
      ["DIME", 0],
      ["QUARTER", 0],
      ["ONE", 0],
      ["FIVE", 0],
      ["TEN", 0],
      ["TWENTY", 0],
      ["ONE HUNDRED", 0],
    ],
  };

  // get sum of all of the number values in cid
  const sumOfAllchangeInDrawer = roundToTwo(
    flattenArray(cid)
      .filter((el) => typeof el === "number")
      .reduce((acc, curr) => acc + curr)
  );

  // if the total value of cid is < changeOwed
  // then return {status: "INSUFFICIENT_FUNDS", change: []}
  if (sumOfAllchangeInDrawer < changeOwed) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // if the total value of cid is === changeOwed
  // then return {status: "CLOSED", change: cid}
  if (sumOfAllchangeInDrawer === changeOwed) {
    return { status: "CLOSED", change: cid };
  }

  // loop through cid from highest to lowest denominations.
  for (let i = cid.length - 1; i >= 0; i--) {
    const denomination = {
      name: cid[i][0], // QUARTER
      value: denominations[cid[i][0]], // 0.25
      valueInDrawer: changeInDrawer[i][1], // 4.25
      qtyInDrawer: roundToTwo(changeInDrawer[i][1] / denominations[cid[i][0]]), // 17
    };

    // skip this iteration if denomination is greater than changeOwed
    // skip this iteration if denomination is not available in the drawer
    if (denomination.value > changeOwed || denomination.qtyInDrawer < 1)
      continue;

    // calculate how much of the current denomination to transfer
    // from drawer to hand
    let valueToPickup = 0;
    while (
      roundToTwo(valueToPickup + denomination.value + changeInHand.value) <=
        changeOwed &&
      valueToPickup < changeInDrawer[i][1]
    ) {
      valueToPickup = roundToTwo(valueToPickup + denomination.value);
    }

    // if the value of changeInHand will not exceed changeOwed
    // then complete the transfer from drawer to hand
    if (roundToTwo(changeInHand.value + valueToPickup) <= changeOwed) {
      // subtract valueToPickup from current denomination in changeInDrawer
      changeInDrawer[i][1] = roundToTwo(changeInDrawer[i][1] - valueToPickup);

      // add valueToPickup to changeInHand
      changeInHand.change[i][1] = roundToTwo(
        changeInHand.change[i][1] + valueToPickup
      );
      changeInHand.value = roundToTwo(changeInHand.value + valueToPickup);
    }
    // break out if changeInHand.value === changeOwed
    if (changeInHand.value === changeOwed) break;
  }

  // If the total value of changeInHand is < changeOwed
  // then return {status: "INSUFFICIENT_FUNDS", change: []}
  if (changeInHand.value < changeOwed) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // return {status: "OPEN", change: [...]}, with the change due in
  // coins and bills, sorted in highest to lowest order, as the
  // value of the change key.
  return {
    status: "OPEN",
    change: changeInHand.change
      .reverse()
      .filter((denomination) => denomination[1] !== 0),
  };
}

console.log(
  checkCashRegister(3.26, 100, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
  ])
);
