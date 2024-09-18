'use client'
import {Satisfy} from 'next/font/google';

import workout from '@/public/workouts.json';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

const satify = Satisfy({
  weight: '400',
  subsets: ['latin']
})

function getWorkout(day: number) {
  switch(day) {
    case 1: return workout.monday;
    case 2: return workout.tuesday;
    case 3: return workout.wednesday;
    case 4: return workout.thursday;
    case 5: return workout.friday;
    case 6: return workout.saturday;
    default: return workout.sunday;
  }
}

type Workout = {
  muscle: string;
  regular: Exercise[];
  backup: Exercise[];
} 

type Exercise = {
  exercise: string;
  reps: string;
  sets: number;
} | {
  exercise: string;
  reps: string;
  sets: number;
  time?: undefined;
} | {
  exercise: string;
  time: string;
  sets: number;
  reps?: undefined;
} | {
  exercise: string;
  reps: number;
  sets: number;
}


export default function Home() {
  const [todaysWorkout, setTodaysWorkout] = useState<Workout>(getWorkout(7));

  const [skip, setSkip] = useState<"regular" | "backup">("regular");

  const [countMap, setCountMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {

    const day = (new Date()).getDay();
    
    setTodaysWorkout(getWorkout(day));

    
  }, [])


  useEffect(() => {
    if(skip=='regular') {
      const map: Map<string, number> = new Map();
      todaysWorkout.regular.forEach(exercise => {
        map.set(exercise.exercise, 0);
      })

      setCountMap(map);
    }
    else {
      const map: Map<string, number> = new Map();
      todaysWorkout.backup.forEach(exercise => {
        map.set(exercise.exercise, 0);
      })

      setCountMap(map);
    }
  
  }, [skip, todaysWorkout.backup, todaysWorkout.regular])


  function skipButton(ev: ChangeEvent<HTMLInputElement>) {
    if(ev.target.checked) {
      setSkip("backup");
    }
    else setSkip("regular");
  }


  return (
    <div className="flex flex-col  min-h-screen p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p className={satify.className + " text-2xl"}>Today&apos;s Workout Plan</p>
      <div className='flex gap-5 justify-end'>
        <p>Target Muscles</p>
        <p>{todaysWorkout.muscle}</p>
      </div>
      {skip=="backup" && <p>Skipping Workout today? Try these home workouts</p>}
      {
        <div className='flex flex-col overflow-y-scroll items-end'>
          {
            skip=="regular"
            ? todaysWorkout.regular.map(exercise => <Workout key={exercise.exercise} exercise={exercise} countMap={countMap} setCountMap={setCountMap}/>)
            : todaysWorkout.backup.map(exercise => <Workout key={exercise.exercise} exercise={exercise} countMap={countMap} setCountMap={setCountMap}/>)
          }
        </div>
      }
      <div className='flex gap-10'>

        <p>Skip today&apos;s workout?</p>
        <input onChange={skipButton} type='checkbox'/>
      </div>
    </div>
  );
}

function Workout({
  exercise, countMap, setCountMap
}: {
  exercise: Exercise, countMap: Map<string, number>, setCountMap: Dispatch<SetStateAction<Map<string, number>>>
}) {

  const updateCount = () => {
    
    const map = new Map(countMap);
    map.set(exercise.exercise, map.get(exercise.exercise)! + 1);
    setCountMap(map);
  }


  return (
    <div className='w-3/4 max-w-48'>
      <p>{exercise.exercise}</p>
      <div className='flex justify-between'>
        <p>{exercise.reps} Reps</p>
        <p>{exercise.sets} Sets</p>
      </div>
      <div className='flex gap-10 justify-start items-start'>
        <p>Completed Sets</p>
        <div className='flex flex-col'>
          <p>{countMap.get(exercise.exercise)}</p>
          <button onClick={updateCount}>+</button>
        </div>
      </div>
    </div>
  )
}