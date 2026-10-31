import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Logo } from "./Logo";

const PIN_HASH_KEY = "dotly:pin-hash";
const PIN_LENGTH = 6;

type LockPhase = "setup" | "locked" | "change" | "unlocked";
type LockState = {
  phase: LockPhase;
  storedHash: string;
  error: string;
};

function readLockState(): LockState {
  try {
    const savedHash = localStorage.getItem(PIN_HASH_KEY);
    return {
      phase: savedHash ? "locked" : "setup",
      storedHash: savedHash ?? "",
      error: "",
    };
  } catch {
    return {
      phase: "setup",
      storedHash: "",
      error: "Could not read the lock setting from this browser.",
    };
  }
}

async function hashPin(pin: string) {
  const data = new TextEncoder().encode(pin);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

interface PinLockControls {
  onChangePin: () => void;
}

export function PinLock({
  children,
}: {
  children: (controls: PinLockControls) => ReactNode;
}) {
  const [lockState, setLockState] = useState(readLockState);
  const { phase, storedHash, error } = lockState;
  const [pin, setPin] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [currentPin, setCurrentPin] = useState("");

  function updateLockState(changes: Partial<LockState>) {
    setLockState((current) => ({ ...current, ...changes }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateLockState({ error: "" });

    if (!new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin)) {
      updateLockState({ error: `Enter a ${PIN_LENGTH}-digit PIN.` });
      return;
    }

    try {
      if (phase === "change") {
        if (await hashPin(currentPin) !== storedHash) {
          updateLockState({ error: "Your current PIN is incorrect." });
          setCurrentPin("");
          return;
        }
        if (pin !== confirmation) {
          updateLockState({ error: "The new PINs do not match." });
          setConfirmation("");
          return;
        }

        const newHash = await hashPin(pin);
        localStorage.setItem(PIN_HASH_KEY, newHash);
        setLockState({ phase: "unlocked", storedHash: newHash, error: "" });
        setPin("");
        setConfirmation("");
        setCurrentPin("");
        return;
      }

      const enteredHash = await hashPin(pin);
      if (phase === "locked") {
        if (enteredHash !== storedHash) {
          updateLockState({
            error: "That PIN is incorrect. Try again or reset the lock.",
          });
          setPin("");
          return;
        }
        updateLockState({ phase: "unlocked" });
        setPin("");
        return;
      }

      if (pin !== confirmation) {
        updateLockState({ error: "The PINs do not match." });
        setConfirmation("");
        return;
      }

      localStorage.setItem(PIN_HASH_KEY, enteredHash);
      setLockState({ phase: "unlocked", storedHash: enteredHash, error: "" });
      setPin("");
      setConfirmation("");
    } catch {
      updateLockState({
        error: "Could not save or verify the PIN. Check browser storage and try again.",
      });
    }
  }

  function resetLock() {
    if (
      !window.confirm(
        "Reset the PIN lock? Your tasks will remain saved in this browser.",
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem(PIN_HASH_KEY);
      setLockState({ phase: "setup", storedHash: "", error: "" });
      setPin("");
      setConfirmation("");
    } catch {
      updateLockState({
        error: "Could not reset the lock setting in this browser.",
      });
    }
  }

  function startPinChange() {
    setCurrentPin("");
    setPin("");
    setConfirmation("");
    setLockState((current) => ({ ...current, phase: "change", error: "" }));
  }

  function cancelPinChange() {
    setCurrentPin("");
    setPin("");
    setConfirmation("");
    setLockState((current) => ({ ...current, phase: "unlocked", error: "" }));
  }

  if (phase === "unlocked") return children({ onChangePin: startPinChange });

  const isSetup = phase === "setup";
  const isChanging = phase === "change";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-surface p-6">
        <div className="flex justify-center">
          <Logo className="h-12" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-bold text-fg">
            {isSetup
              ? "Set up your PIN"
              : isChanging
                ? "Change your PIN"
                : "Unlock Dotly"}
          </h1>
          <p className="text-sm text-muted">
            {isSetup
              ? `Create a ${PIN_LENGTH}-digit PIN to use when you reopen Dotly.`
              : isChanging
                ? "Verify your current PIN, then choose a new one."
                : "Enter your PIN to continue."}
          </p>
          <p className="text-xs text-muted">
            This is a convenience lock, not encryption. Tasks remain in browser
            storage and may be accessible to someone with technical access to
            this device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isChanging && (
            <Input
              type="password"
              inputMode="numeric"
              pattern={`\\d{${PIN_LENGTH}}`}
              maxLength={PIN_LENGTH}
              autoComplete="current-password"
              value={currentPin}
              onChange={(event) =>
                setCurrentPin(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Current PIN"
              aria-label="Current PIN"
              className="w-full text-center tracking-[0.4em]"
              autoFocus
            />
          )}
          <Input
            type="password"
            inputMode="numeric"
            pattern={`\\d{${PIN_LENGTH}}`}
            maxLength={PIN_LENGTH}
            autoComplete={isSetup || isChanging ? "new-password" : "current-password"}
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
            placeholder={
              isChanging ? "New PIN" : `${PIN_LENGTH}-digit PIN`
            }
            aria-label={isChanging ? "New PIN" : `${PIN_LENGTH}-digit PIN`}
            className="w-full text-center tracking-[0.4em]"
            autoFocus={!isChanging}
          />
          {(isSetup || isChanging) && (
            <Input
              type="password"
              inputMode="numeric"
              pattern={`\\d{${PIN_LENGTH}}`}
              maxLength={PIN_LENGTH}
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) =>
                setConfirmation(event.target.value.replace(/\D/g, ""))
              }
              placeholder={isChanging ? "Confirm new PIN" : "Confirm PIN"}
              aria-label={isChanging ? "Confirm new PIN" : "Confirm PIN"}
              className="w-full text-center tracking-[0.4em]"
            />
          )}
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <div className={isChanging ? "flex gap-2" : ""}>
            {isChanging && (
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={cancelPinChange}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className={isChanging ? "flex-1" : "w-full"}>
              {isSetup ? "Set PIN" : isChanging ? "Save new PIN" : "Unlock"}
            </Button>
          </div>
        </form>

        {!isSetup && (
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="text-sm"
              onClick={resetLock}
            >
              Forgot PIN? Reset lock
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
