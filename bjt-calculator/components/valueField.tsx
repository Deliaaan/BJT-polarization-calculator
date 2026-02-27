import Form from "next/form";

export default function sumOfTwo() {
    return (
        <form>
            <input type="number" name="sum1" id="sum1" />
            <input type="number" name="sum2" id="sum2" />
            <button>Calculate</button>
        </form>
    )
}