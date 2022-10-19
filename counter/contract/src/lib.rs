use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{log, near_bindgen};

/**
 * Counter Contract
 */
#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Counter {
    val: i8,
}

#[near_bindgen]
impl Counter {
    /**
     * get num function
     */
    pub fn get_num(&self) -> i8 {
        return self.val;
    }

    /**
     * increment function
     */
    pub fn increment(&mut self) {
        self.val += 1;
        log!("Increased number to {}", self.val);
    }

    /**
     * decrement function
     */
    pub fn decrement(&mut self) {
        self.val -= 1;
        log!("Decreased number to {}", self.val);
    }

    /**
     * reset function
     */
    pub fn reset(&mut self) {
        self.val = 0;
        log!("Reset counter to zero");
    }
}

// use the attribute below for unit tests
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn increment() {
        // create Counter Contract object
        let mut contract = Counter { val: 0 };
        contract.increment();
        // check
        assert_eq!(1, contract.get_num());
    }

    #[test]
    fn decrement() {
        // create Counter Contract object
        let mut contract = Counter { val: 0 };
        contract.decrement();
        assert_eq!(-1, contract.get_num());
    }

    #[test]
    fn increment_and_reset() {
        // create Counter Contract object
        let mut contract = Counter { val: 0 };
        contract.increment();
        contract.reset();
        assert_eq!(0, contract.get_num());
    }

    #[test]
    #[should_panic]
    fn panics_on_overflow() {
        // create Counter Contract object
        let mut contract = Counter { val: 127 };
        contract.increment();
    }

    #[test]
    #[should_panic]
    fn panics_on_underflow() {
        // create Counter Contract object
        let mut contract = Counter { val: -128 };
        contract.decrement();
    }
}
